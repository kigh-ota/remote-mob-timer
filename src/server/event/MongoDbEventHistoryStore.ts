import IEvent, { EventType } from '../../common/IEvent';
import { Collection, MongoClient } from 'mongodb';
import EventHistoryStore from './EventHistoryStore';
import { TimerId } from '../../common/TimerId';

const DB_NAME = 'remote-mob-timer';
const COLLECTION_NAME = 'events';

export default class MongoDbEventHistoryStore implements EventHistoryStore {
  private coll: Collection;

  constructor(mongoClient: MongoClient) {
    this.coll = mongoClient.db(DB_NAME).collection(COLLECTION_NAME);
  }

  public async add(event: IEvent) {
    await this.coll.insertOne(event);
  }

  public listExceptClient(id: TimerId, limit: number): Promise<IEvent[]> {
    const idCondition =
      id === '1'
        ? {
            $or: [
              { id },
              { id: { $exists: false } }, // think of doc without id as doc with id = 1
            ],
          }
        : { id };
    return this.coll
      .find({
        $and: [
          idCondition,
          {
            $and: [
              { type: { $ne: EventType.CLIENT_REGISTERED } },
              { type: { $ne: EventType.CLIENT_UNREGISTERED } },
            ],
          },
        ],
      })
      .sort({ _id: -1 })
      .limit(limit)
      .toArray();
  }
}
