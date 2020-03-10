import IEvent, { EventType } from '../../common/IEvent';
import EventHistoryStore from './EventHistoryStore';
import { TimerId } from '../../common/TimerId';

const MAX_HISTORY_LENGTH = 10000;

export default class InMemoryEventHistoryStore implements EventHistoryStore {
  private history: IEvent[] = [];

  public async add(event: IEvent) {
    if (this.history.length === MAX_HISTORY_LENGTH) {
      this.history.shift();
    }
    this.history.push(event);
  }

  public listExceptClient(id: TimerId): Promise<IEvent[]> {
    return Promise.resolve(
      this.history
        .filter(e => e.id === id)
        .filter(
          e =>
            e.type !== EventType.CLIENT_REGISTERED &&
            e.type !== EventType.CLIENT_UNREGISTERED
        )
        .reverse()
    );
  }
}
