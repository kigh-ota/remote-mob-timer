import InMemoryTimerRepository from './timer/InMemoryTimerRepository';
import EventHistoryStore from './event/EventHistoryStore';
import StatusJson from '../common/StatusJson';
import EventFactory from './event/EventFactory';
import { TimerId } from '../common/TimerId';
import ServerEventSender from './sse/ServerEventSender';
import TimerMetadataRepository from './timer/TimerMetadataRepository';
import TimerRepository from './timer/TimerRepository';
import TimerService from './timer/TimerService';

export const TIMER_SEC = 25 * 60;

const UseCases = {
  initializeApp: async (
    timerService: TimerService,
    timerMetadataRepository: TimerMetadataRepository
  ) => {
    const metadatas = await timerMetadataRepository.list();
    for (const metadata of metadatas) {
      await timerService.add(metadata.id, metadata.name, TIMER_SEC);
    }
  },
  addTimer: async (id: TimerId, name: string, timerService: TimerService) => {
    await timerService.add(id, name, TIMER_SEC);
  },
  getTimerStatus: async (
    id: TimerId,
    pool: TimerRepository,
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
      // clients: timer.clientInfoMap(),
      eventHistory,
    };
    return statusJson;
  },
  resetTimer: (
    id: TimerId,
    sec: number,
    userName: string,
    pool: InMemoryTimerRepository,
    eventHistoryStore: EventHistoryStore,
    serverEventSender: ServerEventSender
  ) => {
    const timer = pool.get(id);
    timer.clock.stop();
    timer.clock.setTime(sec);
    timer.clock.start();
    const event = EventFactory.start(sec, userName, timer.getName(), id);
    serverEventSender.send(event, timer.clientPool);
    eventHistoryStore.add(event);
  },
  toggleTimer: (
    id: TimerId,
    userName: string,
    pool: InMemoryTimerRepository,
    eventHistoryStore: EventHistoryStore,
    serverEventSender: ServerEventSender
  ) => {
    const timer = pool.get(id);
    if (timer.clock.getTime() > 0) {
      if (timer.clock.isRunning()) {
        timer.clock.stop();
        const event = EventFactory.stop(
          timer.clock.getTime(),
          userName,
          timer.getName(),
          id
        );
        serverEventSender.send(event, timer.clientPool);
        eventHistoryStore.add(event);
      } else {
        timer.clock.start();
        const event = EventFactory.start(
          timer.clock.getTime(),
          userName,
          timer.getName(),
          id
        );
        serverEventSender.send(event, timer.clientPool);
        eventHistoryStore.add(event);
      }
    }
    return {
      isRunning: timer.clock.isRunning(),
      time: timer.clock.getTime(),
    };
  },
  listTimers: (pool: InMemoryTimerRepository) => pool.listMetadata(),
  changeTimerName: async (
    id: TimerId,
    name: string,
    pool: InMemoryTimerRepository,
    timerMetadataRepository: TimerMetadataRepository
  ) => {
    pool.get(id).setName(name);
    await timerMetadataRepository.put({ id, name });
  },
  sayGood: (
    id: TimerId,
    userName: string,
    pool: InMemoryTimerRepository,
    eventHistoryStore: EventHistoryStore,
    serverEventSender: ServerEventSender
  ) => {
    const timer = pool.get(id);
    const event = EventFactory.good(id, userName, timer.getName());
    serverEventSender.send(event, timer.clientPool);
    eventHistoryStore.add(event);
  },
};

export default UseCases;
