import { EventType } from '../common/IEvent';
import IntervalTimer from './IntervalTimer';
import ConnectionTimeoutWatcher from './ConnectionTimeoutWatcher';
import { Observable, fromEvent, merge, Subscription } from 'rxjs';

export default class ReconnectingEventSource extends EventTarget {
  private evtSource: EventSource | null;
  private allEventsSubscription: Subscription | null;
  private reconnecter: IntervalTimer;
  private connectionTimeoutWatcher: ConnectionTimeoutWatcher;
  private isConnected: boolean;

  constructor(
    private readonly url: string,
    private readonly onConnected: Function,
    private readonly onDisconnected: Function,
    connectionTimeoutSec: number
  ) {
    super();
    this.evtSource = null;
    this.allEventsSubscription = null;
    this.connectionTimeoutWatcher = new ConnectionTimeoutWatcher(() => {
      if (this.isConnected) {
        this.isConnected = false;
        this.handleDisconnected();
      }
    }, connectionTimeoutSec);
    this.isConnected = true;
    this.connectionTimeoutWatcher.notify();
    this.reconnecter = new IntervalTimer(this.tryToConnect.bind(this), 20);
    this.tryToConnect();
  }

  private tryToConnect() {
    if (this.evtSource) {
      this.evtSource.close();
      this.evtSource = null;
      this.allEventsSubscription.unsubscribe();
      this.allEventsSubscription = null;
    }
    this.evtSource = new (<any>window).EventSource(this.url); // FIXME  error TS2339: Property 'EventSource' does not exist on type 'Window'.
    const allEvents = Object.values(EventType).map(eventType =>
      fromEvent(this.evtSource, eventType)
    );
    this.allEventsSubscription = merge(...allEvents).subscribe(
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
