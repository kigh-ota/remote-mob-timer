import ClientInfo from './ClientInfo';
import { TimerId } from './TimerId';
// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export default interface IEvent {
  type: EventType;
  data: unknown;
  // Only type and data will be sent to clients
  id: TimerId;
  date: string; // ISO 8601
}

export enum EventType {
  START = 'start',
  STOP = 'stop',
  TICK = 'tick',
  OVER = 'over',
  GOOD = 'good',
  ALIVE = 'alive',
  CLIENT_REGISTERED = 'client:registered',
  CLIENT_UNREGISTERED = 'client:unregistered',
}

export interface StartEvent extends IEvent {
  type: EventType.START;
  data: { sec: number; userName: string; timerName: string };
}

export interface StopEvent extends IEvent {
  type: EventType.STOP;
  data: { sec: number; userName: string; timerName: string };
}

export interface TickEvent extends IEvent {
  type: EventType.TICK;
  data: { sec: number };
}

export interface OverEvent extends IEvent {
  type: EventType.OVER;
  data: { timerName: string };
}

export interface GoodEvent extends IEvent {
  type: EventType.GOOD;
  data: { userName: string; timerName: string };
}

export interface AliveEvent extends IEvent {
  type: EventType.ALIVE;
  data: {};
}

export interface ClientRegisteredEvent extends IEvent {
  type: EventType.CLIENT_REGISTERED;
  data: ClientInfo;
}

export interface ClientUnregisteredEvent extends IEvent {
  type: EventType.CLIENT_UNREGISTERED;
  data: ClientInfo;
}
