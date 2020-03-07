import Timer, { TimerId } from './Timer';

const MAX_TIMER_COUNT = 20;

export default class TimerPool {
  private pool: {
    [id: string]: Timer;
  } = {};

  public add(remoteMobTimer: Timer) {
    if (Object.keys(this.pool).length === MAX_TIMER_COUNT) {
      throw new Error('Mamimum number of timers reached');
    }
    const id = remoteMobTimer.getId();
    if (
      this.list()
        .map(t => t.id)
        .includes(id)
    ) {
      throw new Error(`id (${id}) already exists`);
    }
    this.pool[id] = remoteMobTimer;
  }

  public exists(id: TimerId) {
    return Object.keys(this.pool).includes(id);
  }

  public get(id: TimerId) {
    return this.pool[id];
  }

  public list(): Array<{
    id: TimerId;
    name: string;
  }> {
    return Object.keys(this.pool).map(id => ({
      id: id as TimerId,
      name: this.pool[id].getName(),
    }));
  }
}
