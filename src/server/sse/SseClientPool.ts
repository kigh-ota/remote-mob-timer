import { TimerId } from '../../common/TimerId';
import SseClient from '../../common/SseClient';

export default interface SseClientPool {
  add(data: unknown, timerId: TimerId): void;
  forEach(fn: (client: SseClient) => void): void;
  count(): number;
}
