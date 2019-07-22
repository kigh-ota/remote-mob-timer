import IEvent from '../common/IEvent';

class EventHistoryStore {
  private history: IEvent[] = [];

  public add(event: IEvent): void {
    this.history.push(event);
  }

  public list(): IEvent[] {
    return this.history;
  }
}

export default EventHistoryStore;
