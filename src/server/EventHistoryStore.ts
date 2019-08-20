import IEvent from '../common/IEvent';

export default interface EventHistoryStore {
  add(event: IEvent): void;
  listExceptClient(id: string, limit: number): Promise<IEvent[]>;
}
