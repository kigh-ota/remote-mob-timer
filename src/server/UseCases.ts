import TimerPool from './timer/TimerPool';
import Timer, { TimerId } from './timer/Timer';
import EventHistoryStore from './event/EventHistoryStore';
import StatusJson from '../common/StatusJson';
import EventFactory from './event/EventFactory';
import ServerEvent from './web/ServerEvent';

export const TIMER_SEC = 25 * 60;

const UseCases = {
  addTimer: (
    id: TimerId,
    name: string,
    pool: TimerPool,
    eventHistoryStore: EventHistoryStore
  ) => {
    const timer = new Timer(eventHistoryStore, id, name, TIMER_SEC);
    pool.add(timer);
  },
  getTimerStatus: async (
    id: TimerId,
    pool: TimerPool,
    eventHistoryStore: EventHistoryStore
  ) => {
    const timer = pool.get(id);
    const MAX_HISTORY_LENGTH = 100;
    const eventHistory = await eventHistoryStore.listExceptClient(
      id,
      MAX_HISTORY_LENGTH
    );
    const statusJson: StatusJson = {
      timer: {
        name: timer.getName(),
        time: timer.clock.getTime(),
        nClient: timer.clientPool.count(),
        isRunning: timer.clock.isRunning(),
      },
      clients: timer.clientInfoMap(),
      eventHistory,
    };
    return statusJson;
  },
  resetTimer: (
    id: TimerId,
    sec: number,
    userName: string,
    pool: TimerPool,
    eventHistoryStore: EventHistoryStore
  ) => {
    const timer = pool.get(id);
    timer.clock.stop();
    timer.clock.setTime(sec);
    timer.clock.start();
    const event = EventFactory.start(sec, userName, id);
    ServerEvent.send(event, timer.clientPool);
    eventHistoryStore.add(event);
  },
  toggleTimer: (
    id: TimerId,
    userName: string,
    pool: TimerPool,
    eventHistoryStore: EventHistoryStore
  ) => {
    const timer = pool.get(id);
    if (timer.clock.getTime() > 0) {
      if (timer.clock.isRunning()) {
        timer.clock.stop();
        const event = EventFactory.stop(timer.clock.getTime(), userName, id);
        ServerEvent.send(event, timer.clientPool);
        eventHistoryStore.add(event);
      } else {
        timer.clock.start();
        const event = EventFactory.start(timer.clock.getTime(), userName, id);
        ServerEvent.send(event, timer.clientPool);
        eventHistoryStore.add(event);
      }
    }
    return {
      isRunning: timer.clock.isRunning(),
      time: timer.clock.getTime(),
    };
  },
  listTimers: (pool: TimerPool) => pool.list(),
  changeTimerName: (id: TimerId, name: string, pool: TimerPool) => {
    pool.get(id).setName(name);
  },
  sayGood: (
    id: TimerId,
    userName: string,
    pool: TimerPool,
    eventHistoryStore: EventHistoryStore
  ) => {
    const timer = pool.get(id);
    const event = EventFactory.good(id, userName);
    ServerEvent.send(event, timer.clientPool);
    eventHistoryStore.add(event);
  },
};

export default UseCases;
