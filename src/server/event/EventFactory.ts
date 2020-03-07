import { EventType, StartEvent } from '../../common/IEvent';
import { TimerId } from '../timer/Timer';
import {
  StopEvent,
  TickEvent,
  OverEvent,
  GoodEvent,
  AliveEvent,
  ClientRegisteredEvent,
  ClientUnregisteredEvent,
} from '../../common/IEvent';
import ClientInfo from '../../common/ClientInfo';

export default class EventFactory {
  public static start(
    sec: number,
    userName: string,
    timerName: string,
    id: TimerId
  ): StartEvent {
    return {
      type: EventType.START,
      id,
      data: { sec, userName, timerName },
      date: new Date().toISOString(),
    };
  }
  public static stop(
    sec: number,
    userName: string,
    timerName: string,
    id: TimerId
  ): StopEvent {
    return {
      type: EventType.STOP,
      id,
      data: { sec, userName, timerName },
      date: new Date().toISOString(),
    };
  }
  public static tick(sec: number, id: TimerId): TickEvent {
    return {
      type: EventType.TICK,
      id,
      data: { sec },
      date: new Date().toISOString(),
    };
  }
  public static over(id: TimerId, timerName: string): OverEvent {
    return {
      type: EventType.OVER,
      id,
      data: { timerName },
      date: new Date().toISOString(),
    };
  }
  public static good(
    id: TimerId,
    userName: string,
    timerName: string
  ): GoodEvent {
    return {
      type: EventType.GOOD,
      id,
      data: { userName, timerName },
      date: new Date().toISOString(),
    };
  }
  public static alive(id: TimerId): AliveEvent {
    return {
      type: EventType.ALIVE,
      id,
      data: {},
      date: new Date().toISOString(),
    };
  }
  public static clientRegistered(
    clientInfo: ClientInfo,
    id: TimerId
  ): ClientRegisteredEvent {
    return {
      type: EventType.CLIENT_REGISTERED,
      id,
      data: clientInfo,
      date: new Date().toISOString(),
    };
  }
  public static clientUnregistered(
    clientInfo: ClientInfo,
    id: TimerId
  ): ClientUnregisteredEvent {
    return {
      type: EventType.CLIENT_UNREGISTERED,
      id,
      data: clientInfo,
      date: new Date().toISOString(),
    };
  }
}
