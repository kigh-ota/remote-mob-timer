import IEvent, { EventType } from '../common/IEvent';
import EventHistoryStore from './EventHistoryStore';

const MAX_HISTORY_LENGTH: number = 10000;

export default class InMemoryEventHistoryStore implements EventHistoryStore {
  private history: IEvent[] = [];

  public add(event: IEvent): void {
    if (this.history.length === MAX_HISTORY_LENGTH) {
      this.history.shift();
    }
    this.history.push(event);
  }

  public listExceptClient(limit: number): Promise<IEvent[]> {
    return Promise.resolve(
      this.history
        .filter(
          e =>
            e.type !== EventType.CLIENT_REGISTERED &&
            e.type !== EventType.CLIENT_UNREGISTERED
        )
        .reverse()
    );
  }
}
