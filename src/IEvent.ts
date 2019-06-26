interface IEvent {
  type: 'start' | 'stop' | 'tick' | 'over';
  data: any;
}
