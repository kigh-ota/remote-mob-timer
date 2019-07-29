declare module 'eventsourcemock' {
  interface EventSourceConfigurationType {
    withCredentials: boolean;
  }

  const sources: { [key: string]: EventSource };

  class EventSource {
    constructor(url: string, configuration?: EventSourceConfigurationType);
    addEventListener(eventName: string, listener: Function): void;
    removeEventListener(eventName: string, listener: Function): void;
    close(): void;
    emit(eventName: string, messageEvent?: MessageEvent): void;
    emitError(error: any): void;
    emitOpen(): void;
    emitMessage(message: any): void;
  }
}
