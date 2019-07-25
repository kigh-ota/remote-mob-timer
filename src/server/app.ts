import createError from 'http-errors';
import express, { Response } from 'express';
import path from 'path';
import logger from 'morgan';
import Timer from './Timer';
import IEvent from '../common/IEvent';
import EventHistoryStore from './EventHistoryStore';
import EventFactory from './EventFactory';
import ClientInfo from '../common/ClientInfo';
import StatusJson from '../common/StatusJson';

const app = express();
const eventHistoryStore = new EventHistoryStore();

// view engine setup
app.set('views', path.join(__dirname, '..', '..', 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, '..', '..', 'public')));

const TIMER_SEC = 25 * 60;

const timer = new Timer(
  (sec: number) => sendServerEvent(EventFactory.tick(sec)),
  () => {
    const event = EventFactory.over();
    sendServerEvent(event);
    eventHistoryStore.add(event);
  }
);

// Main Endpoint
app.get('/', (req, res, next) => {
  res.render('index');
});

interface Client {
  response: Response;
  ip: string;
  userAgent: string;
}

// Endpoint for Server-Sent Events
// Ref. https://qiita.com/akameco/items/c54af5af35ef9b500b54
let clientId = 0;
let clients: { [clientId: number]: Client } = {};
app.get('/events', (req, res) => {
  req.socket.setTimeout(43200);
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-store'
  });
  res.write('\n');
  (clientId => {
    const clientInfo = { ip: req.ip, userAgent: req.header('User-Agent') };
    clients[clientId] = {
      response: res,
      ip: req.ip,
      userAgent: req.header('User-Agent')
    };
    console.log(`Registered client: id=${clientId}`);
    eventHistoryStore.add(EventFactory.clientRegistered(clientInfo));
    req.on('close', () => {
      delete clients[clientId];
      console.log(`Unregistered client: id=${clientId}`);
      eventHistoryStore.add(EventFactory.clientUnregistered(clientInfo));
    });
  })(++clientId);
});

function sendServerEvent(event: IEvent) {
  const dataString = JSON.stringify(event.data);
  const payload = `event: ${event.type}\ndata: ${dataString}\n\n`;
  console.log(`sendServerEvent(): ${payload.replace(/\n/g, ' ')}`);
  for (let clientId in clients) {
    clients[clientId].response.write(payload);
  }
}

app.get('/status.json', (req, res, next) => {
  const statusJson: StatusJson = {
    timer: {
      time: timer.getTime(),
      nClient: Object.keys(clients).length,
      isRunning: timer.isRunning()
    },
    clients: clientInfoMap(),
    eventHistory: eventHistoryStore.list()
  };
  res.json(statusJson);
});

function clientInfoMap(): { [clientId: number]: ClientInfo } {
  const ret: { [clientId: number]: ClientInfo } = {};
  for (let clientId in clients) {
    ret[clientId] = {
      userAgent: clients[clientId].userAgent,
      ip: clients[clientId].ip
    };
  }
  return ret;
}

app.post('/reset', (req, res, next) => {
  timer.stop();
  const sec = req.query.sec ? Number(req.query.sec) : TIMER_SEC;
  timer.setTime(sec);
  timer.start();
  const event = EventFactory.start(sec, decodeURIComponent(req.query.name));
  sendServerEvent(event);
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
      sendServerEvent(event);
      eventHistoryStore.add(event);
    } else {
      timer.start();
      const event = EventFactory.start(
        timer.getTime(),
        decodeURIComponent(req.query.name)
      );
      sendServerEvent(event);
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

timer.setTime(TIMER_SEC);

const SEND_ALIVE_INTERVAL_SEC = 5;
setInterval(
  () => sendServerEvent(EventFactory.alive()),
  SEND_ALIVE_INTERVAL_SEC * 1000
);

module.exports = app;
