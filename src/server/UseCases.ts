import TimerPool from './timer/TimerPool';
import Timer, { TimerId } from './timer/Timer';
import EventHistoryStore from './event/EventHistoryStore';

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
  listTimers: (pool: TimerPool) => pool.list(),
  changeTimerName: (id: TimerId, name: string, pool: TimerPool) => {
    pool.get(id).setName(name);
  },
};

export default UseCases;
