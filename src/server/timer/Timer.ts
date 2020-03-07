import ClientPool from '../web/ClientPool';
import TimerClock from './clock/TimerClock';
import EventHistoryStore from '../event/EventHistoryStore';
import EventFactory from '../event/EventFactory';
import ServerEvent from '../web/ServerEvent';
import ClientInfo from '../../common/ClientInfo';
import { interval } from 'rxjs';
import { Brand } from '../Brand';

export type TimerId = Brand<string, 'TimerId'>;

export default class Timer {
  public readonly clientPool: ClientPool;
  public readonly clock: TimerClock;
  private readonly id: TimerId;
  private name: string;

  constructor(
    eventHistoryStore: EventHistoryStore,
    id: TimerId,
    name: string,
    defaultTimerSec: number
  ) {
    this.clientPool = new ClientPool(eventHistoryStore);
    this.clock = new TimerClock(
      (sec: number) =>
        ServerEvent.send(EventFactory.tick(sec, id), this.clientPool),
      () => {
        const event = EventFactory.over(id);
        ServerEvent.send(event, this.clientPool);
        eventHistoryStore.add(event);
      }
    );
    this.clock.setTime(defaultTimerSec);
    this.id = id;
    this.name = name;

    const SEND_ALIVE_INTERVAL_SEC = 5;
    interval(SEND_ALIVE_INTERVAL_SEC * 1000).subscribe(() =>
      ServerEvent.send(EventFactory.alive(id), this.clientPool)
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
}
