import EventHistoryStore from './EventHistoryStore';
import { MongoClient } from 'mongodb';
import MongoDbEventHistoryStore from './MongoDbEventHistoryStore';
import InMemoryEventHistoryStore from './InMemoryEventHistoryStore';
import log from '../Logger';
import TimerMetadataRepository from '../timer/TimerMetadataRepository';
import InMemoryTimerMetadataRepository from '../timer/InMemoryTimerMetadataRepository';
import MongoDbTimerMetadataRepository from '../timer/MongoDbTimerMetadataRepository';
import admin from 'firebase-admin';
import FirebaseTimerMetadataRepository from '../timer/FirestoreTimerMetadataRepository';
import FirestoreEventHistoryStore from './FirestoreEventHistoryStore';

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

async function createFireStore() {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const databaseURL = process.env.FIRESTORE_DATABASE_URL;
  const serviceAccount = JSON.parse(process.env.FIRESTORE_SERVICE_ACCOUNT_JSON);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL,
  });
  const db = admin.firestore();
  return {
    eventHistoryStore: new FirestoreEventHistoryStore(db),
    timerMetadataRepository: new FirebaseTimerMetadataRepository(db),
  };
}

type PersistenceType = 'INMEMORY' | 'MONGODB' | 'FIRESTORE';

export default class RepositoryFactory {
  public static async create(): Promise<Ret> {
    const type = process.env.PERSISTENCE_TYPE as PersistenceType;
    switch (type) {
      case 'INMEMORY':
        log.info('Using in-memory stores');
        return createInMemory();
      case 'MONGODB':
        log.info('Using MongoDB stores');
        return createMongoDb();
      case 'FIRESTORE':
        log.info('Using FireStore stores');
        return createFireStore();
      default:
        throw new Error(`Invalid PERSISTENCE_TYPE: ${type}`);
    }
  }
}
