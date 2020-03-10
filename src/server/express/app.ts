import express, { Express } from 'express';
import path from 'path';
import logger from 'morgan';
import EventHistoryStoreFactory from '../event/EventHistoryStoreFactory';
import InMemoryTimerRepository from '../timer/InMemoryTimerRepository';
import setupEndpoints from './Endpoints';
import UseCases, { TIMER_SEC } from '../UseCases';
import log from '../Logger';
import favicon from 'serve-favicon';
import ExpressServerEventSender from './ExpressServerEventSender';
import ExpressSseClientPool from './ExpressSseClientPool';
import InMemoryTimerMetadataRepository from '../timer/InMemoryTimerMetadataRepository';
import TimerService from '../timer/TimerService';

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
  const eventHistoryStore = useInMemoryStore()
    ? await EventHistoryStoreFactory.createInMemory()
    : await EventHistoryStoreFactory.createMongoDb();
  const timerRepository = new InMemoryTimerRepository();
  const serverEventSender = new ExpressServerEventSender();
  const Pool = ExpressSseClientPool;
  const timerMetadataRepository = new InMemoryTimerMetadataRepository();
  const timerService = new TimerService(
    timerRepository,
    eventHistoryStore,
    serverEventSender,
    Pool,
    timerMetadataRepository
  );
  await UseCases.initializeApp(timerService, timerMetadataRepository);
  setupEndpoints(
    app,
    timerRepository,
    eventHistoryStore,
    serverEventSender,
    TIMER_SEC,
    timerMetadataRepository,
    timerService
  );
}

const app = initializeExpress();
main(app);

module.exports = app;
