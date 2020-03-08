import express, { Express } from 'express';
import path from 'path';
import logger from 'morgan';
import EventHistoryStoreFactory from '../event/EventHistoryStoreFactory';
import InMemoryTimerRepository from '../timer/InMemoryTimerRepository';
import setupEndpoints from './Endpoints';
import UseCases, { TIMER_SEC } from '../UseCases';
import log from '../Logger';
import favicon from 'serve-favicon';
import { TimerId } from '../../common/TimerId';
import ExpressServerEventSender from './ExpressServerEventSender';
import ExpressSseClientPool from './ExpressSseClientPool';

function initializeExpress(): Express {
  const app = express();

  // view engine setup
  app.set(
    'views',
    path.join(__dirname, '..', '..', '..', 'src', 'static', 'express', 'views')
  );
  app.set('view engine', 'pug');

  app.use(logger('dev'));
  app.use(express.json());
  app.use(
    favicon(
      path.join(__dirname, '..', '..', '..', 'public', 'images', 'favicon.ico')
    )
  );
  app.use(express.urlencoded({ extended: false }));
  app.use(express.static(path.join(__dirname, '..', '..', '..', 'public')));

  return app;
}

function useInMemoryStore(): boolean {
  const ret = process.env.USE_IN_MEMORY_STORE === '1';
  if (ret) {
    log.info('Using in-memory store...');
  }
  return ret;
}

async function main(app: Express) {
  const historyStore = useInMemoryStore()
    ? await EventHistoryStoreFactory.createInMemory()
    : await EventHistoryStoreFactory.createMongoDb();
  const pool = new InMemoryTimerRepository();
  const sender = new ExpressServerEventSender();
  const Pool = ExpressSseClientPool;
  UseCases.addTimer('1' as TimerId, 'Timer1', pool, historyStore, sender, Pool);
  UseCases.addTimer('2' as TimerId, 'Timer2', pool, historyStore, sender, Pool);
  UseCases.addTimer('3' as TimerId, 'Timer3', pool, historyStore, sender, Pool);
  UseCases.addTimer('4' as TimerId, 'Timer4', pool, historyStore, sender, Pool);
  UseCases.addTimer('5' as TimerId, 'Timer5', pool, historyStore, sender, Pool);
  setupEndpoints(app, pool, historyStore, sender, TIMER_SEC, Pool);
}

const app = initializeExpress();
main(app);

module.exports = app;
