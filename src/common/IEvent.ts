// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export default interface IEvent {
  type: EventType;
  data: unknown;
  // Only type and data will be sent to clients
  id: string;
  date: string; // ISO 8601
}

export enum EventType {
  TIMER_START = 'start',
  TIMER_STOP = 'stop',
  TIMER_TICK = 'tick',
  TIMER_OVER = 'over',
  ALIVE = 'alive',
  CLIENT_REGISTERED = 'client:registered',
  CLIENT_UNREGISTERED = 'client:unregistered',
}
