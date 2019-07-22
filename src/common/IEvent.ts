export default interface IEvent {
  type: EventType;
  data: any;
}

export enum EventType {
  TIMER_START = 'start',
  TIMER_STOP = 'stop',
  TIMER_TICK = 'tick',
  TIMER_OVER = 'over',
  ALIVE = 'alive'
}
