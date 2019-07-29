import { Observable, interval, Subscription } from 'rxjs';

export default class IntervalTimer {
  private subscription: Subscription | null;

  constructor(
    private readonly callback: () => void,
    private readonly intervalSec: number
  ) {
    this.subscription = null;
  }

  public start() {
    this.stop();
    this.subscription = interval(this.intervalSec * 1000).subscribe(() => {
      console.debug('IntervalTimer: timeout');
      this.callback();
    });
  }

  public stop() {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }
}
