import { TimerId } from '../server/timer/Timer';

export default interface TimerJson {
  id: TimerId;
  name: string;
}
