import ExpressClientPool from '../express/ExpressClientPool';
import TimerClock from './clock/TimerClock';
import EventHistoryStore from '../event/EventHistoryStore';
import EventFactory from '../event/EventFactory';
import ExpressServerEvent from '../express/ExpressServerEvent';
import ClientInfo from '../../common/ClientInfo';
import { interval } from 'rxjs';
import { TimerId } from '../../common/TimerId';

export default class Timer {
  public readonly clientPool: ExpressClientPool;
  public readonly clock: TimerClock;
  private readonly id: TimerId;
  private name: string;

  constructor(
    eventHistoryStore: EventHistoryStore,
    id: TimerId,
    name: string,
    defaultTimerSec: number
  ) {
    this.clientPool = new ExpressClientPool(eventHistoryStore);
    this.clock = new TimerClock(
      (sec: number) =>
        ExpressServerEvent.send(EventFactory.tick(sec, id), this.clientPool),
      () => {
        const event = EventFactory.over(id, this.getName());
        ExpressServerEvent.send(event, this.clientPool);
        eventHistoryStore.add(event);
      }
    );
    this.clock.setTime(defaultTimerSec);
    this.id = id;
    this.setName(name);

    const SEND_ALIVE_INTERVAL_SEC = 5;
    interval(SEND_ALIVE_INTERVAL_SEC * 1000).subscribe(() =>
      ExpressServerEvent.send(EventFactory.alive(id), this.clientPool)
    );
  }

  public clientInfoMap(): { [clientId: number]: ClientInfo } {
    const ret: { [clientId: number]: ClientInfo } = {};
    this.clientPool.forEach((id, res, ip, userAgent) => {
      ret[id] = { ip, userAgent };
    });
    return ret;
  }

  public getId(): TimerId {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public setName(name: string): void {
    if (name.match(/^\s*$/)) {
      this.name = '(Unnamed)';
      return;
    }
    this.name = name;
  }
}
