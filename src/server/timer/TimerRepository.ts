import Timer from './Timer';
import { TimerId } from '../../common/TimerId';

export default interface TimerRepository {
  add(timer: Timer): void;
  exists(id: TimerId): boolean;
  get(id: TimerId): Timer;
  listMetadata(): TimerMetadata[];
}

export interface TimerMetadata {
  id: TimerId;
  name: string;
}
