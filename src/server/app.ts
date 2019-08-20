import express from 'express';
import { Express } from 'express';
import path from 'path';
import logger from 'morgan';
import Endpoints from './Endpoints';
import RemoteMobTimer from './RemoteMobTimer';
import EventHistoryStoreFactory from './EventHistoryStoreFactory';

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
  const remoteMobTimer = new RemoteMobTimer(eventHistoryStore, TIMER_SEC);
  Endpoints.setup(app, remoteMobTimer, eventHistoryStore, TIMER_SEC);
}

const app = initializeExpress();
main(app);

module.exports = app;
