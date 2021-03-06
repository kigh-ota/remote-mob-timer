import IEvent, { EventType } from '../../common/IEvent';
import EventHistoryStore from './EventHistoryStore';
import { TimerId } from '../../common/TimerId';

const COLLECTION_NAME = 'events';
const CLIENT_COLLECTION_NAME = 'clientEvents';

const eventTypesExceptClient = Object.entries(EventType)
  .map(a => a[1])
  .filter(
    e =>
      ![EventType.CLIENT_REGISTERED, EventType.CLIENT_UNREGISTERED].includes(e)
  );

export default class FirestoreEventHistoryStore implements EventHistoryStore {
  private readonly colRef: FirebaseFirestore.CollectionReference;
  private readonly clientColRef: FirebaseFirestore.CollectionReference;

  constructor(private readonly db: FirebaseFirestore.Firestore) {
    this.colRef = db.collection(COLLECTION_NAME);
    this.clientColRef = db.collection(CLIENT_COLLECTION_NAME);
  }

  public async add(event: IEvent) {
    if (eventTypesExceptClient.includes(event.type)) {
      await this.colRef.doc().set(event);
    } else {
      await this.clientColRef.doc().set(event);
    }
  }

  // Not guaranteed to return `limit` events, since Firestore doesn't support OR nor NOT filters.
  public async listExceptClient(id: TimerId, limit: number): Promise<IEvent[]> {
    const docs = await this.colRef
      .where('id', '==', id)
      .orderBy('date', 'desc')
      .limit(limit)
      .get();
    const ret: IEvent[] = [];
    docs.forEach(d => {
      if (eventTypesExceptClient.includes(d.data().type)) {
        ret.push(d.data() as IEvent);
      }
    });
    return ret;
  }
}
