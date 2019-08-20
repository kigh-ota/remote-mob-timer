import IEvent, { EventType } from '../common/IEvent';

export default class EventFactory {
  public static start(sec: number, name: string, id: string): IEvent {
    return {
      type: EventType.TIMER_START,
      id,
      data: { sec, name },
      date: new Date().toISOString()
    };
  }
  public static stop(sec: number, name: string, id: string): IEvent {
    return {
      type: EventType.TIMER_STOP,
      id,
      data: { sec, name },
      date: new Date().toISOString()
    };
  }
  public static tick(sec: number, id: string): IEvent {
    return {
      type: EventType.TIMER_TICK,
      id,
      data: { sec },
      date: new Date().toISOString()
    };
  }
  public static over(id: string): IEvent {
    return {
      type: EventType.TIMER_OVER,
      id,
      data: {},
      date: new Date().toISOString()
    };
  }
  public static alive(id: string): IEvent {
    return {
      type: EventType.ALIVE,
      id,
      data: {},
      date: new Date().toISOString()
    };
  }
  public static clientRegistered(clientInfo: object, id: string): IEvent {
    return {
      type: EventType.CLIENT_REGISTERED,
      id,
      data: clientInfo,
      date: new Date().toISOString()
    };
  }
  public static clientUnregistered(clientInfo: object, id: string): IEvent {
    return {
      type: EventType.CLIENT_UNREGISTERED,
      id,
      data: clientInfo,
      date: new Date().toISOString()
    };
  }
}
