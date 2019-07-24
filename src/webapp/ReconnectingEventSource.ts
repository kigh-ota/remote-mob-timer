import { EventType } from '../common/IEvent';
import IntervalTimer from './IntervalTimer';
import ConnectionTimeoutWatcher from './ConnectionTimeoutWatcher';

export default class ReconnectingEventSource extends EventTarget {
  private evtSource: EventSource | null;
  private reconnecter: IntervalTimer;
  private connectionTimeoutWatcher: ConnectionTimeoutWatcher;
  private isConnected: boolean;

  constructor(
    private readonly onConnected: Function,
    private readonly onDisconnected: Function
  ) {
    super();
    this.evtSource = null;
    this.connectionTimeoutWatcher = new ConnectionTimeoutWatcher(() => {
      if (this.isConnected) {
        this.isConnected = false;
        this.handleDisconnected();
      }
    });
    this.isConnected = true;
    this.connectionTimeoutWatcher.notify();
    this.reconnecter = new IntervalTimer(this.tryToConnect, 20);
    this.tryToConnect();
  }

  private tryToConnect() {
    if (this.evtSource) {
      this.evtSource.close();
      this.evtSource = null;
    }
    this.evtSource = new EventSource('/events/');
    for (const eventType in EventType) {
      this.evtSource.addEventListener(
        EventType[eventType],
        (e: MessageEvent) => {
          console.log(`${e.type}: ${e.data}`);
          this.connectionTimeoutWatcher.notify();
          if (!this.isConnected) {
            this.isConnected = true;
            this.handleConnected();
          }
          this.dispatchEvent(new MessageEvent(e.type, event));
        }
      );
    }
  }

  private handleConnected() {
    this.reconnecter.stop();
    this.onConnected();
    console.debug('ReconnectingEventSource: connected');
  }

  private handleDisconnected() {
    this.reconnecter.start();
    this.onDisconnected();
    console.debug('ReconnectingEventSource: disconnected');
  }
}
