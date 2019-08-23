import RemoteMobTimer from './RemoteMobTimer';

export default class RemoteMobTimerPool {
  private pool: {
    [id: string]: RemoteMobTimer;
  } = {};

  public add(remoteMobTimer: RemoteMobTimer, id: string) {
    this.pool[id] = remoteMobTimer;
  }

  public exists(id: string) {
    return Object.keys(this.pool).includes(id);
  }

  public get(id: string) {
    return this.pool[id];
  }

  public listIds() {
    return Object.keys(this.pool);
  }
}
