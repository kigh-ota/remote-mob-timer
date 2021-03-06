import express, { Express } from 'express';
import path from 'path';
import logger from 'morgan';
import RepositoryFactory from '../event/RepositoryFactory';
import InMemoryTimerRepository from '../timer/InMemoryTimerRepository';
import setupEndpoints from './Endpoints';
import UseCases, { TIMER_SEC } from '../UseCases';
import favicon from 'serve-favicon';
import ExpressServerEventSender from './ExpressServerEventSender';
import ExpressSseClientPool from './ExpressSseClientPool';
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

async function main(app: Express) {
  const {
    eventHistoryStore,
    timerMetadataRepository,
  } = await RepositoryFactory.create();
  const timerRepository = new InMemoryTimerRepository();
  const serverEventSender = new ExpressServerEventSender();
  const Pool = ExpressSseClientPool;
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
