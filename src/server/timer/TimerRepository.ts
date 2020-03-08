import Timer, { TimerId } from './Timer';

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
