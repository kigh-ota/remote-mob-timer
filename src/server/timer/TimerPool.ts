import Timer, { TimerId } from './Timer';
import { Brand } from '../Brand';

export default class TimerPool {
  private pool: {
    [id: string]: Timer;
  } = {};

  public add(remoteMobTimer: Timer) {
    const id = remoteMobTimer.getId();
    if (this.listIds().includes(id)) {
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

  public listIds(): TimerId[] {
    return Object.keys(this.pool) as TimerId[];
  }
}
