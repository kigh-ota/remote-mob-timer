import { Express } from 'express';
import EventHistoryStore from '../event/EventHistoryStore';
import StatusJson from '../../common/StatusJson';
import EventFactory from '../event/EventFactory';
import ServerEvent from './ServerEvent';
import createError from 'http-errors';
import express = require('express');
import TimerPool from '../timer/TimerPool';
import UseCases from '../UseCases';
import { TimerId } from '../timer/Timer';

const ID_PART = ':id(\\d+)';

export default function setupEndpoints(
  app: Express,
  timerPool: TimerPool,
  eventHistoryStore: EventHistoryStore,
  defaultTimerSec: number
) {
  app.get('/', (req, res) => {
    res.render('index');
  });

  // Main Endpoint
  app.get(`/timer/${ID_PART}`, (req, res) => {
    if (!timerPool.exists(req.params.id)) {
      throw new Error(`Timer with id=${req.params.id} does not exist!`);
    }

    if (req.path.slice(-1) !== '/') {
      res.redirect(req.path + '/');
    }

    res.render('timer');
  });

  // Endpoint for Server-Sent Events
  // Ref. https://qiita.com/akameco/items/c54af5af35ef9b500b54
  app.get(`/timer/${ID_PART}/events`, (req, res) => {
    const id = req.params.id;
    const remoteMobTimer = timerPool.get(id);
    req.socket.setTimeout(43200);
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-store',
    });
    res.write('\n');
    remoteMobTimer.clientPool.add(req, res, id);
  });

  app.put(`/v1/timer/${ID_PART}`, (req, res) => {
    const id = req.params.id;
    UseCases.addTimer(
      id as TimerId,
      `Timer${id}`,
      timerPool,
      eventHistoryStore
    );
    res.status(201).end();
  });

  app.get(`/v1/timer/${ID_PART}/status`, async (req, res) => {
    const id = req.params.id;
    const remoteMobTimer = timerPool.get(id);
    const MAX_HISTORY_LENGTH = 100;
    const eventHistory = await eventHistoryStore.listExceptClient(
      id,
      MAX_HISTORY_LENGTH
    );
    const statusJson: StatusJson = {
      timer: {
        name: remoteMobTimer.getName(),
        time: remoteMobTimer.clock.getTime(),
        nClient: remoteMobTimer.clientPool.count(),
        isRunning: remoteMobTimer.clock.isRunning(),
      },
      clients: remoteMobTimer.clientInfoMap(),
      eventHistory,
    };
    res.json(statusJson);
  });

  app.post(`/v1/timer/${ID_PART}/reset`, (req, res) => {
    const id = req.params.id;
    const remoteMobTimer = timerPool.get(id);
    remoteMobTimer.clock.stop();
    const sec = req.query.sec ? Number(req.query.sec) : defaultTimerSec;
    remoteMobTimer.clock.setTime(sec);
    remoteMobTimer.clock.start();
    const event = EventFactory.start(
      sec,
      decodeURIComponent(req.query.name),
      id
    );
    ServerEvent.send(event, remoteMobTimer.clientPool);
    eventHistoryStore.add(event);
    res.send('reset');
  });

  app.post(`/v1/timer/${ID_PART}/toggle`, (req, res) => {
    const id = req.params.id;
    const remoteMobTimer = timerPool.get(id);
    if (remoteMobTimer.clock.getTime() > 0) {
      if (remoteMobTimer.clock.isRunning()) {
        remoteMobTimer.clock.stop();
        const event = EventFactory.stop(
          remoteMobTimer.clock.getTime(),
          decodeURIComponent(req.query.name),
          id
        );
        ServerEvent.send(event, remoteMobTimer.clientPool);
        eventHistoryStore.add(event);
      } else {
        remoteMobTimer.clock.start();
        const event = EventFactory.start(
          remoteMobTimer.clock.getTime(),
          decodeURIComponent(req.query.name),
          id
        );
        ServerEvent.send(event, remoteMobTimer.clientPool);
        eventHistoryStore.add(event);
      }
    }
    res.send({
      isRunning: remoteMobTimer.clock.isRunning(),
      time: remoteMobTimer.clock.getTime(),
    });
  });

  app.put(`/v1/timer/${ID_PART}/name`, (req, res) => {
    const id = req.params.id;
    if (!req.body.hasOwnProperty('name')) {
      res.status(400).end();
      return;
    }
    UseCases.changeTimerName(id, req.body.name, timerPool);
    res.status(200).end();
  });

  app.get(`/v1/timers`, (req, res) => {
    res.json(UseCases.listTimers(timerPool));
  });
  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    next(createError(404));
  });

  // error handler
  app.use(function(err, req, res) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  } as express.ErrorRequestHandler);
}
