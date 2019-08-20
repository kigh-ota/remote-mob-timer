import ClientPool from './ClientPool';
import Timer from './Timer';
import EventHistoryStore from './EventHistoryStore';
import EventFactory from './EventFactory';
import ServerEvent from './ServerEvent';
import ClientInfo from '../common/ClientInfo';
import { interval } from 'rxjs';

export default class RemoteMobTimer {
  public readonly clientPool: ClientPool;
  public readonly timer: Timer;

  constructor(eventHistoryStore: EventHistoryStore, defaultTimerSec: number) {
    this.clientPool = new ClientPool(eventHistoryStore);
    this.timer = new Timer(
      (sec: number) =>
        ServerEvent.send(EventFactory.tick(sec), this.clientPool),
      () => {
        const event = EventFactory.over();
        ServerEvent.send(event, this.clientPool);
        eventHistoryStore.add(event);
      }
    );
    this.timer.setTime(defaultTimerSec);

    const SEND_ALIVE_INTERVAL_SEC = 5;
    interval(SEND_ALIVE_INTERVAL_SEC * 1000).subscribe(() =>
      ServerEvent.send(EventFactory.alive(), this.clientPool)
    );
  }

  public clientInfoMap(): { [clientId: number]: ClientInfo } {
    const ret: { [clientId: number]: ClientInfo } = {};
    this.clientPool.forEach((id, res, ip, userAgent) => {
      ret[id] = { ip, userAgent };
    });
    return ret;
  }
}
