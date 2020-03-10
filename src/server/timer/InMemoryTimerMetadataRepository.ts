import TimerMetadataRepository from './TimerMetadataRepository';
import { TimerMetadata } from './TimerRepository';
export default class InMemoryTimerMetadataRepository
  implements TimerMetadataRepository {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async put(metadata: TimerMetadata) {
    // do nothing
  }
}
