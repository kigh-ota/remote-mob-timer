import EventHistoryStore from './EventHistoryStore';
import { MongoClient } from 'mongodb';
import MongoDbEventHistoryStore from './MongoDbEventHistoryStore';
import InMemoryEventHistoryStore from './InMemoryEventHistoryStore';
import log from '../Logger';
import TimerMetadataRepository from '../timer/TimerMetadataRepository';
import InMemoryTimerMetadataRepository from '../timer/InMemoryTimerMetadataRepository';
import MongoDbTimerMetadataRepository from '../timer/MongoDbTimerMetadataRepository';

interface Ret {
  eventHistoryStore: EventHistoryStore;
  timerMetadataRepository: TimerMetadataRepository;
}

async function createMongoDb() {
  const mongoClient = new MongoClient(
    'mongodb://root:example@localhost:27017',
    { useNewUrlParser: true, useUnifiedTopology: true }
  );
  try {
    await mongoClient.connect();
  } catch (err) {
    log.error('Failed to connect to database', err);
    process.exit(1);
  }
  return {
    eventHistoryStore: new MongoDbEventHistoryStore(mongoClient),
    timerMetadataRepository: new MongoDbTimerMetadataRepository(mongoClient),
  };
}

async function createInMemory() {
  return {
    eventHistoryStore: new InMemoryEventHistoryStore(),
    timerMetadataRepository: new InMemoryTimerMetadataRepository(),
  };
}

type PersistenceType = 'IN_MEMORY' | 'MONGO_DB' | 'FIRE_STORE';

export default class RepositoryFactory {
  public static async create(): Promise<Ret> {
    const type = process.env.PERSISTENCE_TYPE;
    switch (type) {
      case 'IN_MEMORY':
        log.info('Using in-memory stores');
        return createInMemory();
      case 'MONGO_DB':
        log.info('Using MongoDB stores');
        return createMongoDb();
      case 'FIRE_STORE':
        log.info('Using FireStore stores');
        throw new Error('to be implemented');
      default:
        throw new Error(`Invalid PERSISTENCE_TYPE: ${type}`);
    }
  }
}
