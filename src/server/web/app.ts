import express from 'express';
import { Express } from 'express';
import path from 'path';
import logger from 'morgan';
import Timer, { TimerId } from '../timer/Timer';
import EventHistoryStoreFactory from '../event/EventHistoryStoreFactory';
import TimerPool from '../timer/TimerPool';
import setupEndpoints from './Endpoints';
import UseCases, { TIMER_SEC } from '../UseCases';

function initializeExpress(): Express {
  const app = express();

  // view engine setup
  app.set('views', path.join(__dirname, '..', '..', '..', 'views'));
  app.set('view engine', 'pug');

  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.use(express.static(path.join(__dirname, '..', '..', '..', 'public')));

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
  const eventHistoryStore = useInMemoryStore()
    ? await EventHistoryStoreFactory.createInMemory()
    : await EventHistoryStoreFactory.createMongoDb();
  const pool = new TimerPool();
  UseCases.addTimer('1' as TimerId, pool, eventHistoryStore);
  UseCases.addTimer('2' as TimerId, pool, eventHistoryStore);
  UseCases.addTimer('3' as TimerId, pool, eventHistoryStore);
  UseCases.addTimer('4' as TimerId, pool, eventHistoryStore);
  UseCases.addTimer('5' as TimerId, pool, eventHistoryStore);
  setupEndpoints(app, pool, eventHistoryStore, TIMER_SEC);
}

const app = initializeExpress();
main(app);

module.exports = app;
