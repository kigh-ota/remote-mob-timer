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
    connectionTimeoutSec: number,
    reconnectingIntervalSec: number
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
    this.connectionTimeoutWatcher.notify();
    this.reconnecter = new IntervalTimer(
      this.tryToConnect.bind(this),
      reconnectingIntervalSec
    );
    this.tryToConnect();
    this.isConnected = true;
    this.handleConnected();
  }

  private tryToConnect() {
    if (this.evtSource) {
      this.evtSource.close();
      this.evtSource = null;
      this.allEventsSubscription.unsubscribe();
      this.allEventsSubscription = null;
    }
    this.evtSource = this.createEventSource(this.url);
    const allEvents = Object.values(EventType).map(eventType =>
      fromEvent(this.evtSource, eventType)
    );
    this.allEventsSubscription = merge(...allEvents).subscribe(
      (e: MessageEvent) => {
        console.debug(`${e.type}: ${e.data}`);
        this.connectionTimeoutWatcher.notify();
        if (!this.isConnected) {
          this.isConnected = true;
          this.handleConnected();
        }
        this.dispatchEvent(new MessageEvent(e.type, event));
      }
    );
  }

  private createEventSource(url: string) {
    return new (<any>window).EventSource(url); // FIXME  error TS2339: Property 'EventSource' does not exist on type 'Window'.
  }

  private handleConnected() {
    this.reconnecter.stop();
    this.onConnected();
    this.dispatchEvent(new Event('connected'));
    console.debug('ReconnectingEventSource: connected');
  }

  private handleDisconnected() {
    this.reconnecter.start();
    this.onDisconnected();
    this.dispatchEvent(new Event('disconnected'));
    console.debug('ReconnectingEventSource: disconnected');
  }
}
