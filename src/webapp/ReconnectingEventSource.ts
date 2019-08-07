import { EventType } from '../common/IEvent';
import IntervalTimer from './IntervalTimer';
import { Observable, fromEvent, merge, Subscription } from 'rxjs';
import { timeout, first } from 'rxjs/operators';
import { assert } from './util';

export default class ReconnectingEventSource extends EventTarget {
  private evtSource: EventSource | null;
  private allEventsSubscription: Subscription | null;
  private reconnecter: IntervalTimer;
  private isConnected: boolean;

  constructor(
    private readonly url: string,
    private readonly connectionTimeoutSec: number,
    reconnectingIntervalSec: number
  ) {
    super();
    this.evtSource = null;
    this.allEventsSubscription = null;
    this.reconnecter = new IntervalTimer(
      this.tryToConnect.bind(this),
      reconnectingIntervalSec
    );
    this.tryToConnect();
  }

  private tryToConnect() {
    if (this.evtSource) {
      this.evtSource.close();
      this.evtSource = null;
    }
    if (this.allEventsSubscription) {
      this.allEventsSubscription.unsubscribe();
      this.allEventsSubscription = null;
    }

    this.evtSource = this.createEventSource(this.url);
    const anyEvents = this.createAnyEvents();

    this.waitForFirstEvent(anyEvents);
    this.allEventsSubscription = this.subscribeAllEvents(anyEvents);
  }

  private waitForFirstEvent(anyEvents: Observable<Event>) {
    anyEvents.pipe(first()).subscribe((e: MessageEvent) => {
      assert(!this.isConnected);
      this.isConnected = true;
      this.handleConnected(anyEvents);
    });
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

  private handleConnected(anyEvents: Observable<Event>) {
    this.reconnecter.stop();
    this.dispatchEvent(new Event('connected'));
    console.debug('ReconnectingEventSource: connected');
    this.watchConnection(anyEvents);
  }

  private watchConnection(anyEvents: Observable<Event>) {
    anyEvents.pipe(timeout(this.connectionTimeoutSec * 1000)).subscribe(
      () => {}, // do nothing
      () => {
        this.isConnected = false;
        this.handleDisconnected();
      }
    );
  }

  private handleDisconnected() {
    this.reconnecter.start();
    this.dispatchEvent(new Event('disconnected'));
    console.debug('ReconnectingEventSource: disconnected');
  }
}
