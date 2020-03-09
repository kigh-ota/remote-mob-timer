export interface SseClientInfo {
  ip: string;
  userAgent: string;
}

export default interface SseClient {
  getInfo(): SseClientInfo;
  send(payload: string): void;
}
