import TimerMetadataRepository from './TimerMetadataRepository';
import { TimerMetadata } from './TimerRepository';
import { TimerId } from '../../common/TimerId';

const COLLECTION_NAME = 'timers';

export default class FirebaseTimerMetadataRepository
  implements TimerMetadataRepository {
  private readonly colRef: FirebaseFirestore.CollectionReference;

  constructor(db: FirebaseFirestore.Firestore) {
    this.colRef = db.collection(COLLECTION_NAME);
  }

  public async put(metadata: TimerMetadata) {
    await this.colRef.doc(metadata.id).set({
      name: metadata.name,
    });
  }

  public async list() {
    const allDocs = await this.colRef.get();
    const ret: TimerMetadata[] = [];
    allDocs.forEach(d => {
      ret.push({
        id: d.id as TimerId,
        name: d.data().name,
      });
    });
    return ret;
  }
}
