import IEvent, { EventType } from '../common/IEvent';
import { Collection, MongoClient } from 'mongodb';
import EventHistoryStore from './EventHistoryStore';

const DB_NAME = 'remote-mob-timer';
const COLLECTION_NAME = 'events';

export default class MongoDbEventHistoryStore implements EventHistoryStore {
  private coll: Collection;

  constructor(mongoClient: MongoClient) {
    this.coll = mongoClient.db(DB_NAME).collection(COLLECTION_NAME);
  }

  public add(event: IEvent): void {
    this.coll.insertOne(event);
  }

  public listExceptClient(limit: number): Promise<IEvent[]> {
    return this.coll
      .find({
        $or: [
          { type: { $ne: EventType.CLIENT_REGISTERED } },
          { type: { $ne: EventType.CLIENT_UNREGISTERED } }
        ]
      })
      .sort({ _id: -1 })
      .limit(limit)
      .toArray();
  }
}
