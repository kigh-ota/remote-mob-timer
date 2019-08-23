import EventHistoryStore from './EventHistoryStore';
import { MongoClient } from 'mongodb';
import MongoDbEventHistoryStore from './MongoDbEventHistoryStore';
import InMemoryEventHistoryStore from './InMemoryEventHistoryStore';

export default class EventHistoryStoreFactory {
  public static async createMongoDb(): Promise<EventHistoryStore> {
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

  public static async createInMemory(): Promise<EventHistoryStore> {
    return new InMemoryEventHistoryStore();
  }
}
