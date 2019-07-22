export default interface IEvent {
  type: 'start' | 'stop' | 'tick' | 'over' | 'alive';
  data: any;
}
