import Timer from './Timer';
import { Express } from 'express';
import EventHistoryStore from './EventHistoryStore';
import ClientPool from './ClientPool';
import StatusJson from '../common/StatusJson';
import ClientInfo from '../common/ClientInfo';
import EventFactory from './EventFactory';
import ServerEvent from './ServerEvent';
import createError from 'http-errors';
import express = require('express');

function clientInfoMap(
  clientPool: ClientPool
): { [clientId: number]: ClientInfo } {
  const ret: { [clientId: number]: ClientInfo } = {};
  clientPool.forEach((id, res, ip, userAgent) => {
    ret[id] = { ip, userAgent };
  });
  return ret;
}

export default class Endpoints {
  public static setup(
    app: Express,
    timer: Timer,
    eventHistoryStore: EventHistoryStore,
    clientPool: ClientPool,
    defaultTimerSec: number
  ) {
    // Main Endpoint
    app.get('/', (req, res) => {
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

    app.get('/status.json', (req, res) => {
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

    app.post('/reset', (req, res) => {
      timer.stop();
      const sec = req.query.sec ? Number(req.query.sec) : defaultTimerSec;
      timer.setTime(sec);
      timer.start();
      const event = EventFactory.start(sec, decodeURIComponent(req.query.name));
      ServerEvent.send(event, clientPool);
      eventHistoryStore.add(event);
      res.send('reset');
    });

    app.post('/toggle', (req, res) => {
      if (timer.getTime() > 0) {
        if (timer.isRunning()) {
          timer.stop();
          const event = EventFactory.stop(
            timer.getTime(),
            decodeURIComponent(req.query.name)
          );
          ServerEvent.send(event, clientPool);
          eventHistoryStore.add(event);
        } else {
          timer.start();
          const event = EventFactory.start(
            timer.getTime(),
            decodeURIComponent(req.query.name)
          );
          ServerEvent.send(event, clientPool);
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
    app.use(<express.ErrorRequestHandler>function(err, req, res) {
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};

      // render the error page
      res.status(err.status || 500);
      res.render('error');
    });
  }
}
