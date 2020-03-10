import TimerMetadataRepository from './TimerMetadataRepository';
import { TimerMetadata } from './TimerRepository';
import { TimerId } from '../../common/TimerId';

const COLLECTION_NAME = 'timers';

export default class FirebaseTimerMetadataRepository
  implements TimerMetadataRepository {
  constructor(private readonly db: FirebaseFirestore.Firestore) {}

  public async put(metadata: TimerMetadata) {
    await this.db
      .collection(COLLECTION_NAME)
      .doc(metadata.id)
      .set({
        name: metadata.name,
      });
  }

  public async list() {
    const allDocs = await this.db.collection(COLLECTION_NAME).get();
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
