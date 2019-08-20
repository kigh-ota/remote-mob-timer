import { Express } from 'express';
import EventHistoryStore from './EventHistoryStore';
import StatusJson from '../common/StatusJson';
import EventFactory from './EventFactory';
import ServerEvent from './ServerEvent';
import createError from 'http-errors';
import express = require('express');
import RemoteMobTimer from './RemoteMobTimer';

export default class Endpoints {
  public static setup(
    app: Express,
    remoteMobTimer: RemoteMobTimer,
    eventHistoryStore: EventHistoryStore,
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
      remoteMobTimer.clientPool.add(req, res);
    });

    app.get('/status.json', async (req, res) => {
      const MAX_HISTORY_LENGTH = 100;
      const eventHistory = await eventHistoryStore.listExceptClient(
        MAX_HISTORY_LENGTH
      );
      const statusJson: StatusJson = {
        timer: {
          time: remoteMobTimer.timer.getTime(),
          nClient: remoteMobTimer.clientPool.count(),
          isRunning: remoteMobTimer.timer.isRunning()
        },
        clients: remoteMobTimer.clientInfoMap(),
        eventHistory
      };
      res.json(statusJson);
    });

    app.post('/reset', (req, res) => {
      remoteMobTimer.timer.stop();
      const sec = req.query.sec ? Number(req.query.sec) : defaultTimerSec;
      remoteMobTimer.timer.setTime(sec);
      remoteMobTimer.timer.start();
      const event = EventFactory.start(sec, decodeURIComponent(req.query.name));
      ServerEvent.send(event, remoteMobTimer.clientPool);
      eventHistoryStore.add(event);
      res.send('reset');
    });

    app.post('/toggle', (req, res) => {
      if (remoteMobTimer.timer.getTime() > 0) {
        if (remoteMobTimer.timer.isRunning()) {
          remoteMobTimer.timer.stop();
          const event = EventFactory.stop(
            remoteMobTimer.timer.getTime(),
            decodeURIComponent(req.query.name)
          );
          ServerEvent.send(event, remoteMobTimer.clientPool);
          eventHistoryStore.add(event);
        } else {
          remoteMobTimer.timer.start();
          const event = EventFactory.start(
            remoteMobTimer.timer.getTime(),
            decodeURIComponent(req.query.name)
          );
          ServerEvent.send(event, remoteMobTimer.clientPool);
          eventHistoryStore.add(event);
        }
      }
      res.send({
        isRunning: remoteMobTimer.timer.isRunning(),
        time: remoteMobTimer.timer.getTime()
      });
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
