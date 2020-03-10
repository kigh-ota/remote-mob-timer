import IEvent from '../../common/IEvent';
import { TimerId } from '../../common/TimerId';

export default interface EventHistoryStore {
  add(event: IEvent): Promise<void>;
  listExceptClient(id: TimerId, limit: number): Promise<IEvent[]>;
}
