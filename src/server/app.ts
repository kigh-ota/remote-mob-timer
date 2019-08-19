import createError from 'http-errors';
import express, { Request, Response } from 'express';
import { Express } from 'express';
import path from 'path';
import logger from 'morgan';
import Timer from './Timer';
import IEvent from '../common/IEvent';
import EventHistoryStore from './EventHistoryStore';
import EventFactory from './EventFactory';
import ClientInfo from '../common/ClientInfo';
import StatusJson from '../common/StatusJson';
import { interval } from 'rxjs';

function initializeExpress(): Express {
  const app = express();

  // view engine setup
  app.set('views', path.join(__dirname, '..', '..', 'views'));
  app.set('view engine', 'pug');

  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.use(express.static(path.join(__dirname, '..', '..', 'public')));

  return app;
}

function sendServerEvent(event: IEvent, clientPool: ClientPool) {
  const dataString = JSON.stringify(event.data);
  const payload = `event: ${event.type}\ndata: ${dataString}\n\n`;
  console.log(`sendServerEvent(): ${payload.replace(/\n/g, ' ')}`);
  clientPool.forEach((id, res) => {
    res.write(payload);
  });
}

function setupTimer(
  eventHistoryStore: EventHistoryStore,
  clientPool: ClientPool
): Timer {
  const timer = new Timer(
    (sec: number) => sendServerEvent(EventFactory.tick(sec), clientPool),
    () => {
      const event = EventFactory.over();
      sendServerEvent(event, clientPool);
      eventHistoryStore.add(event);
    }
  );
  timer.setTime(TIMER_SEC);
  return timer;
}

function clientInfoMap(
  clientPool: ClientPool
): { [clientId: number]: ClientInfo } {
  const ret: { [clientId: number]: ClientInfo } = {};
  clientPool.forEach((id, res, ip, userAgent) => {
    ret[id] = { ip, userAgent };
  });
  return ret;
}

function setupEndpoints(
  app: Express,
  timer: Timer,
  eventHistoryStore: EventHistoryStore,
  clientPool: ClientPool
) {
  // Main Endpoint
  app.get('/', (req, res, next) => {
    res.render('index');
  });

  // Endpoint for Server-Sent Events
  // Ref. https://qiita.com/akameco/items/c54af5af35ef9b500b54
  app.get('/events', (req, res) => {
    req.socket.setTimeout(43200);
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-store'
    });
    res.write('\n');
    clientPool.add(req, res);
  });

  app.get('/status.json', (req, res, next) => {
    const statusJson: StatusJson = {
      timer: {
        time: timer.getTime(),
        nClient: clientPool.count(),
        isRunning: timer.isRunning()
      },
      clients: clientInfoMap(clientPool),
      eventHistory: eventHistoryStore.list()
    };
    res.json(statusJson);
  });

  app.post('/reset', (req, res, next) => {
    timer.stop();
    const sec = req.query.sec ? Number(req.query.sec) : TIMER_SEC;
    timer.setTime(sec);
    timer.start();
    const event = EventFactory.start(sec, decodeURIComponent(req.query.name));
    sendServerEvent(event, clientPool);
    eventHistoryStore.add(event);
    res.send('reset');
  });

  app.post('/toggle', (req, res, next) => {
    if (timer.getTime() > 0) {
      if (timer.isRunning()) {
        timer.stop();
        const event = EventFactory.stop(
          timer.getTime(),
          decodeURIComponent(req.query.name)
        );
        sendServerEvent(event, clientPool);
        eventHistoryStore.add(event);
      } else {
        timer.start();
        const event = EventFactory.start(
          timer.getTime(),
          decodeURIComponent(req.query.name)
        );
        sendServerEvent(event, clientPool);
        eventHistoryStore.add(event);
      }
    }
    res.send({ isRunning: timer.isRunning(), time: timer.getTime() });
  });

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    next(createError(404));
  });

  // error handler
  app.use(<express.ErrorRequestHandler>function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });
}

class ClientPool {
  private id = 0;
  private clients: {
    [clientId: number]: ClientInfo & { response: Response };
  } = {};

  constructor(private readonly eventHistoryStore: EventHistoryStore) {}

  public add(request: Request, response: Response) {
    (id => {
      const ip = request.ip;
      const userAgent = request.header('User-Agent');
      const clientInfo = { ip, userAgent };
      this.clients[id] = {
        response,
        ip,
        userAgent
      };
      console.log(`Registered client: id=${id}`);
      eventHistoryStore.add(EventFactory.clientRegistered(clientInfo));
      request.on('close', () => {
        delete this.clients[id];
        console.log(`Unregistered client: id=${id}`);
        eventHistoryStore.add(EventFactory.clientUnregistered(clientInfo));
      });
    })(++this.id);
  }

  public forEach(
    fn: (
      id: number,
      reponse?: Response,
      ip?: string,
      userAgent?: string
    ) => void
  ) {
    for (let id in this.clients) {
      const c = this.clients[id];
      fn(Number(id), c.response, c.ip, c.userAgent);
    }
  }

  public count() {
    return Object.keys(this.clients).length;
  }
}

const TIMER_SEC = 25 * 60;
const eventHistoryStore = new EventHistoryStore();
const clientPool = new ClientPool(eventHistoryStore);
const timer = setupTimer(eventHistoryStore, clientPool);
const app = initializeExpress();
setupEndpoints(app, timer, eventHistoryStore, clientPool);

const SEND_ALIVE_INTERVAL_SEC = 5;
interval(SEND_ALIVE_INTERVAL_SEC * 1000).subscribe(() =>
  sendServerEvent(EventFactory.alive(), clientPool)
);

module.exports = app;
