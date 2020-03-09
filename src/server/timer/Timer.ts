import TimerClock from './clock/TimerClock';
import EventHistoryStore from '../event/EventHistoryStore';
import EventFactory from '../event/EventFactory';
import { interval } from 'rxjs';
import { TimerId } from '../../common/TimerId';
import ServerEventSender from '../sse/ServerEventSender';
import SseClientPool from '../sse/SseClientPool';
import { TimerClockEvents } from './clock/TimerClock';

export default class Timer {
  public readonly clientPool: SseClientPool;
  public readonly clock: TimerClock;
  private readonly id: TimerId;
  private name: string;

  constructor(
    eventHistoryStore: EventHistoryStore,
    id: TimerId,
    name: string,
    defaultTimerSec: number,
    serverEventSender: ServerEventSender,
    ClientPoolImpl: new (eventHistoryStore: EventHistoryStore) => SseClientPool
  ) {
    this.clientPool = new ClientPoolImpl(eventHistoryStore);
    this.clock = new TimerClock()
      .on(TimerClockEvents.TICK, (sec: number) => {
        serverEventSender.send(EventFactory.tick(sec, id), this.clientPool);
      })
      .on(TimerClockEvents.OVER, () => {
        const event = EventFactory.over(id, this.getName());
        serverEventSender.send(event, this.clientPool);
        eventHistoryStore.add(event);
      });
    this.clock.setTime(defaultTimerSec);
    this.id = id;
    this.setName(name);

    const SEND_ALIVE_INTERVAL_SEC = 5;
    interval(SEND_ALIVE_INTERVAL_SEC * 1000).subscribe(() =>
      serverEventSender.send(EventFactory.alive(id), this.clientPool)
    );
  }

  // public clientInfoMap(): { [clientId: number]: SseClient } {
  //   const ret: { [clientId: number]: SseClient } = {};
  //   this.clientPool.forEach((id, res, ip, userAgent) => {
  //     ret[id] = { ip, userAgent };
  //   });
  //   return ret;
  // }

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
