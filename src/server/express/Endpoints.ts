import { Express } from 'express';
import EventHistoryStore from '../event/EventHistoryStore';
import StatusJson from '../../common/StatusJson';
import createError from 'http-errors';
import express = require('express');
import InMemoryTimerRepository from '../timer/InMemoryTimerRepository';
import UseCases from '../UseCases';
import { TimerId } from '../../common/TimerId';
import ServerEventSender from '../sse/ServerEventSender';
import TimerMetadataRepository from '../timer/TimerMetadataRepository';
import TimerService from '../timer/TimerService';

const ID_PART = ':id(\\d+)';

export default function setupEndpoints(
  app: Express,
  timerPool: InMemoryTimerRepository,
  eventHistoryStore: EventHistoryStore,
  serverEventSender: ServerEventSender,
  defaultTimerSec: number,
  timerMetadataRepository: TimerMetadataRepository,
  timerService: TimerService
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
    remoteMobTimer.clientPool.add({ req, res }, id);
  });

  app.put(`/v1/timer/${ID_PART}`, (req, res) => {
    const id = req.params.id;
    UseCases.addTimer(id as TimerId, `Timer${id}`, timerService);
    res.status(201).end();
  });

  app.get(`/v1/timer/${ID_PART}/status`, async (req, res) => {
    const id = req.params.id;
    try {
      const statusJson: StatusJson = await UseCases.getTimerStatus(
        id,
        timerPool,
        eventHistoryStore
      );
      res.json(statusJson);
    } catch {
      res.status(500).end();
    }
  });

  app.post(`/v1/timer/${ID_PART}/reset`, (req, res) => {
    const id = req.params.id;
    const sec = req.query.sec ? Number(req.query.sec) : defaultTimerSec;
    const userName = decodeURIComponent(req.query.name);
    UseCases.resetTimer(
      id,
      sec,
      userName,
      timerPool,
      eventHistoryStore,
      serverEventSender
    );
    res.send('reset');
  });

  app.post(`/v1/timer/${ID_PART}/toggle`, (req, res) => {
    const id = req.params.id;
    const userName = decodeURIComponent(req.query.name);
    const result = UseCases.toggleTimer(
      id,
      userName,
      timerPool,
      eventHistoryStore,
      serverEventSender
    );
    res.send({
      isRunning: result.isRunning,
      time: result.time,
    });
  });

  app.put(`/v1/timer/${ID_PART}/name`, (req, res) => {
    const id = req.params.id;
    if (!req.body.hasOwnProperty('name')) {
      res.status(400).end();
      return;
    }
    UseCases.changeTimerName(
      id,
      req.body.name,
      timerPool,
      timerMetadataRepository
    );
    res.status(200).end();
  });

  app.post(`/v1/timer/${ID_PART}/good`, (req, res) => {
    const id = req.params.id;
    const userName = decodeURIComponent(req.query.name);
    UseCases.sayGood(
      id,
      userName,
      timerPool,
      eventHistoryStore,
      serverEventSender
    );
    res.status(200).end();
  });

  app.get(`/v1/timers`, (req, res) => {
    const timersJson = UseCases.listTimers(timerPool);
    res.json(timersJson);
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
