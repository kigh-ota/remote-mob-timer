import IEvent, { EventType } from '../common/IEvent';
import { Db, Collection } from 'mongodb';

class EventHistoryStore {
  private coll: Collection;
  static readonly COLLECTION_NAME = 'events';

  constructor(private readonly db: Db) {
    this.coll = db.collection(EventHistoryStore.COLLECTION_NAME);
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

export default EventHistoryStore;
