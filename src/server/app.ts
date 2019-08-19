import express from 'express';
import { Express } from 'express';
import path from 'path';
import logger from 'morgan';
import Timer from './Timer';
import EventHistoryStore from './EventHistoryStore';
import EventFactory from './EventFactory';
import { interval } from 'rxjs';
import ClientPool from './ClientPool';
import ServerEvent from './ServerEvent';
import Endpoints from './Endpoints';

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

function setupTimer(
  eventHistoryStore: EventHistoryStore,
  clientPool: ClientPool
): Timer {
  const timer = new Timer(
    (sec: number) => ServerEvent.send(EventFactory.tick(sec), clientPool),
    () => {
      const event = EventFactory.over();
      ServerEvent.send(event, clientPool);
      eventHistoryStore.add(event);
    }
  );
  timer.setTime(TIMER_SEC);
  return timer;
}

const TIMER_SEC = 25 * 60;
const eventHistoryStore = new EventHistoryStore();
const clientPool = new ClientPool(eventHistoryStore);
const timer = setupTimer(eventHistoryStore, clientPool);
const app = initializeExpress();
Endpoints.setup(app, timer, eventHistoryStore, clientPool, TIMER_SEC);

const SEND_ALIVE_INTERVAL_SEC = 5;
interval(SEND_ALIVE_INTERVAL_SEC * 1000).subscribe(() =>
  ServerEvent.send(EventFactory.alive(), clientPool)
);

module.exports = app;
