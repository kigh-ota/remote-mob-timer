import { EventType } from '../common/IEvent';
import { Observable, fromEvent, merge, Subscription, interval } from 'rxjs';
import { timeout, first } from 'rxjs/operators';
import { assert } from './util';
import { EventTarget } from 'event-target-shim';

export default class ReconnectingEventSource extends EventTarget {
  private evtSource: EventSource | null;
  private allEventsSubscription: Subscription | null;
  private reconnecter: Subscription | null;

  constructor(
    private readonly url: string,
    private readonly connectionTimeoutSec: number,
    private readonly reconnectingIntervalSec: number
  ) {
    super();
    this.evtSource = null;
    this.allEventsSubscription = null;
    this.reconnecter = null;
    this.tryToConnect();
  }

  private tryToConnect() {
    this.clearEventSource();
    this.clearAllEventsSubscription();

    this.evtSource = this.createEventSource(this.url);
    const anyEvents = this.createAnyEvents();
    this.waitForConnection(anyEvents);
    this.allEventsSubscription = this.subscribeAllEvents(anyEvents);
  }

  private clearEventSource() {
    if (this.evtSource) {
      this.evtSource.close();
      this.evtSource = null;
    }
  }

  private clearAllEventsSubscription() {
    if (this.allEventsSubscription) {
      this.allEventsSubscription.unsubscribe();
      this.allEventsSubscription = null;
    }
  }

  private waitForConnection(anyEvents: Observable<Event>) {
    anyEvents
      .pipe(first())
      .subscribe((e: MessageEvent) => this.handleConnected(anyEvents));
  }

  private handleConnected(anyEvents: Observable<Event>) {
    if (this.reconnecter /* null if first time */) {
      this.stopReconnector();
    }
    this.dispatchEvent(new Event('connected'));
    console.debug('ReconnectingEventSource: connected');
    this.waitForDisconnection(anyEvents);
  }

  private subscribeAllEvents(anyEvents: Observable<Event>): Subscription {
    return anyEvents.subscribe((e: MessageEvent) => {
      console.debug(`${e.type}: ${e.data}`);
      this.dispatchEvent(new MessageEvent(e.type, event));
    });
  }

  private createAnyEvents() {
    const allEvents = Object.values(EventType).map(eventType =>
      fromEvent(this.evtSource, eventType)
    );
    return merge(...allEvents);
  }

  private createEventSource(url: string) {
    return new (<any>window).EventSource(url); // FIXME  error TS2339: Property 'EventSource' does not exist on type 'Window'.
  }

  private waitForDisconnection(anyEvents: Observable<Event>) {
    anyEvents.pipe(timeout(this.connectionTimeoutSec * 1000)).subscribe(
      () => {}, // do nothing
      () => {
        this.handleDisconnected();
      }
    );
  }

  private handleDisconnected() {
    this.dispatchEvent(new Event('disconnected'));
    console.debug('ReconnectingEventSource: disconnected');
    this.clearAllEventsSubscription();
    this.startReconnector();
  }

  private startReconnector() {
    assert(!this.reconnecter);
    this.reconnecter = interval(this.reconnectingIntervalSec * 1000).subscribe(
      this.tryToConnect.bind(this)
    );
  }

  private stopReconnector() {
    assert(!!this.reconnecter);
    this.reconnecter.unsubscribe();
    this.reconnecter = null;
  }
}
