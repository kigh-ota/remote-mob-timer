import TimerRepository from './TimerRepository';
import EventHistoryStore from '../event/EventHistoryStore';
import ServerEventSender from '../sse/ServerEventSender';
import SseClientPool from '../sse/SseClientPool';
import TimerMetadataRepository from './TimerMetadataRepository';
import Timer from './Timer';
import { TimerId } from '../../common/TimerId';
import log from '../Logger';

export default class TimerService {
  constructor(
    private readonly repository: TimerRepository,
    private readonly eventHistoryStore: EventHistoryStore,
    private readonly serverEventSender: ServerEventSender,
    private readonly ClientPoolImpl: new (
      eventHistoryStore: EventHistoryStore
    ) => SseClientPool,
    private readonly metadataRepository: TimerMetadataRepository
  ) {}

  public async add(
    id: TimerId,
    name: string,
    defaultTimerSec: number
  ): Promise<void> {
    const timer = new Timer(
      this.eventHistoryStore,
      id,
      name,
      defaultTimerSec,
      this.serverEventSender,
      this.ClientPoolImpl
    );
    this.repository.add(timer);
    log.info(`Created timer id=${id}`);
    await this.metadataRepository.put({ id, name });
  }
}
