import Timer from './Timer';
import TimerRepository, { TimerMetadata } from './TimerRepository';
import { TimerId } from '../../common/TimerId';
import Errors from '../Errors';

const MAX_TIMER_COUNT = 20;

export default class InMemoryTimerRepository implements TimerRepository {
  private pool: {
    [id: string]: Timer;
  } = {};

  public add(timer: Timer): void {
    if (Object.keys(this.pool).length >= MAX_TIMER_COUNT) {
      throw new Error(Errors.MaximumNumberOfTimersReached);
    }
    const id = timer.getId();
    if (
      this.listMetadata()
        .map(t => t.id)
        .includes(id)
    ) {
      throw new Error(Errors.TimerIdAlreadyExists);
    }
    this.pool[id] = timer;
  }

  public exists(id: TimerId): boolean {
    return Object.keys(this.pool).includes(id);
  }

  public get(id: TimerId): Timer {
    return this.pool[id];
  }

  public listMetadata(): TimerMetadata[] {
    return Object.keys(this.pool).map(id => ({
      id: id as TimerId,
      name: this.pool[id].getName(),
    }));
  }
}
