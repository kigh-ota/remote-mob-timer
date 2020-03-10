import TimerMetadataRepository from './TimerMetadataRepository';
import { TimerMetadata } from './TimerRepository';
import { TimerId } from '../../common/TimerId';
export default class InMemoryTimerMetadataRepository
  implements TimerMetadataRepository {
  private readonly array: TimerMetadata[];

  constructor() {
    this.array = [
      { id: '1' as TimerId, name: 'Timer1' },
      { id: '2' as TimerId, name: 'Timer2' },
      { id: '3' as TimerId, name: 'Timer3' },
      { id: '4' as TimerId, name: 'Timer4' },
      { id: '5' as TimerId, name: 'Timer5' },
    ];
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async put(metadata: TimerMetadata) {
    // do nothing
  }

  public async list() {
    return JSON.parse(JSON.stringify(this.array));
  }
}
