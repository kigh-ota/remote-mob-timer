import TimerPool from './timer/TimerPool';
import Timer, { TimerId } from './timer/Timer';
import EventHistoryStore from './event/EventHistoryStore';

export const TIMER_SEC = 25 * 60;

const UseCases = {
  addTimer: (
    id: TimerId,
    pool: TimerPool,
    eventHistoryStore: EventHistoryStore
  ) => {
    const timer = new Timer(eventHistoryStore, id, TIMER_SEC);
    pool.add(timer);
  },
  listTimerIds: (pool: TimerPool) => pool.listIds()
};

export default UseCases;
