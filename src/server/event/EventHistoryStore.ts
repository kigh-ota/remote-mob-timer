import IEvent from '../../common/IEvent';
import { TimerId } from '../../common/TimerId';

export default interface EventHistoryStore {
  add(event: IEvent): void;
  listExceptClient(id: TimerId, limit: number): Promise<IEvent[]>;
}
