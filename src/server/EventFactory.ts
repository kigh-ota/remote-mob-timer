import IEvent, { EventType } from '../common/IEvent';

export default class EventFactory {
  public static start(sec: number, name: string): IEvent {
    return {
      type: EventType.TIMER_START,
      data: { sec, name },
      date: new Date().toISOString()
    };
  }
  public static stop(sec: number, name: string): IEvent {
    return {
      type: EventType.TIMER_STOP,
      data: { sec, name },
      date: new Date().toISOString()
    };
  }
  public static tick(sec: number): IEvent {
    return {
      type: EventType.TIMER_TICK,
      data: { sec },
      date: new Date().toISOString()
    };
  }
  public static over(): IEvent {
    return {
      type: EventType.TIMER_OVER,
      data: {},
      date: new Date().toISOString()
    };
  }
  public static alive(): IEvent {
    return { type: EventType.ALIVE, data: {}, date: new Date().toISOString() };
  }
  public static clientRegistered(clientInfo: object): IEvent {
    return {
      type: EventType.CLIENT_REGISTERED,
      data: clientInfo,
      date: new Date().toISOString()
    };
  }
  public static clientUnregistered(clientInfo: object): IEvent {
    return {
      type: EventType.CLIENT_UNREGISTERED,
      data: clientInfo,
      date: new Date().toISOString()
    };
  }
}
