import IEvent from '../common/IEvent';

class EventHistoryStore {
  private history: IEvent[] = [];
  static readonly MAX_HISTORY_LENGTH: number = 100;

  public add(event: IEvent): void {
    if (this.history.length === EventHistoryStore.MAX_HISTORY_LENGTH) {
      this.history.shift();
    }
    this.history.push(event);
  }

  public list(): IEvent[] {
    return this.history;
  }
}

export default EventHistoryStore;
