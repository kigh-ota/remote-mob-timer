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
import { MongoClient } from 'mongodb';
import MongoDbEventHistoryStore from './MongoDbEventHistoryStore';
import InMemoryEventHistoryStore from './InMemoryEventHistoryStore';

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
  clientPool: ClientPool,
  defaultTimerSec: number
): Timer {
  const timer = new Timer(
    (sec: number) => ServerEvent.send(EventFactory.tick(sec), clientPool),
    () => {
      const event = EventFactory.over();
      ServerEvent.send(event, clientPool);
      eventHistoryStore.add(event);
    }
  );
  timer.setTime(defaultTimerSec);
  return timer;
}

async function createMongoDbEventHistoryStore(): Promise<EventHistoryStore> {
  const mongoClient = new MongoClient(
    'mongodb://root:example@localhost:27017',
    { useNewUrlParser: true, useUnifiedTopology: true }
  );
  try {
    await mongoClient.connect();
  } catch (err) {
    console.error('Failed to connect to database', err);
    process.exit(1);
  }
  return new MongoDbEventHistoryStore(mongoClient);
}

async function createInMemoryEventHistoryStore(): Promise<EventHistoryStore> {
  return new InMemoryEventHistoryStore();
}

function useInMemoryStore(): boolean {
  const ret = process.env.USE_IN_MEMORY_STORE === '1';
  if (ret) {
    console.debug('Using in-memory store...');
  }
  return ret;
}

export interface RemoteMobTimer {
  clientPool: ClientPool;
  timer: Timer;
}

async function main(app: Express) {
  const TIMER_SEC = 25 * 60;

  const eventHistoryStore = useInMemoryStore()
    ? await createInMemoryEventHistoryStore()
    : await createMongoDbEventHistoryStore();
  const clientPool = new ClientPool(eventHistoryStore);
  const timer = setupTimer(eventHistoryStore, clientPool, TIMER_SEC);
  const remoteMobTimer = { clientPool, timer };
  Endpoints.setup(app, remoteMobTimer, eventHistoryStore, TIMER_SEC);

  const SEND_ALIVE_INTERVAL_SEC = 5;
  interval(SEND_ALIVE_INTERVAL_SEC * 1000).subscribe(() =>
    ServerEvent.send(EventFactory.alive(), clientPool)
  );
}

const app = initializeExpress();
main(app);

module.exports = app;
