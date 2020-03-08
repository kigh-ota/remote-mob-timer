import { Brand } from './Brand';

export type SseClientId = Brand<number, 'SseClientId'>;

export default interface SseClient {
  id: SseClientId;
  ip: string;
  userAgent: string;
}
