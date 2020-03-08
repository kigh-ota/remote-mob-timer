import IEvent from '../../common/IEvent';
import SseClientPool from './SseClientPool';

export default interface ServerEventSender {
  send(event: IEvent, clientPool: SseClientPool): void;
}
