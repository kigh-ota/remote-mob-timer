import express from 'express';
import { Express } from 'express';
import path from 'path';
import logger from 'morgan';
import Endpoints from './Endpoints';
import Timer from './RemoteMobTimer';
import EventHistoryStoreFactory from './EventHistoryStoreFactory';
import RemoteMobTimerPool from './RemoteMobTimerPool';
import setupEndpoints from './Endpoints';

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

function useInMemoryStore(): boolean {
  const ret = process.env.USE_IN_MEMORY_STORE === '1';
  if (ret) {
    console.debug('Using in-memory store...');
  }
  return ret;
}

async function main(app: Express) {
  const TIMER_SEC = 25 * 60;

  const eventHistoryStore = useInMemoryStore()
    ? await EventHistoryStoreFactory.createInMemory()
    : await EventHistoryStoreFactory.createMongoDb();
  const pool = new RemoteMobTimerPool();
  pool.add(new Timer(eventHistoryStore, '1', TIMER_SEC), '1');
  pool.add(new Timer(eventHistoryStore, '2', TIMER_SEC), '2');
  pool.add(new Timer(eventHistoryStore, '3', TIMER_SEC), '3');
  setupEndpoints(app, pool, eventHistoryStore, TIMER_SEC);
}

const app = initializeExpress();
main(app);

module.exports = app;
