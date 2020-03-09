import { Subscription, interval } from 'rxjs';
import { EventEmitter } from 'events';

export enum TimerClockEvents {
  TICK = 'TICK',
  OVER = 'OVER',
}

class TimerClock extends EventEmitter {
  private timeout: Subscription | null;
  private remainingSec: number;

  constructor() {
    super();
    this.timeout = null;
    this.remainingSec = 0;
  }

  public isRunning(): boolean {
    return !!this.timeout;
  }

  public getTime(): number {
    return this.remainingSec;
  }

  public setTime(sec: number): void {
    if (this.isRunning()) {
      return;
    }
    this.remainingSec = sec;
  }

  public start() {
    if (this.isRunning() || this.remainingSec === 0) {
      return;
    }
    this.timeout = interval(1000).subscribe(() => this.tick());
  }

  public stop() {
    if (!this.isRunning()) {
      return;
    }
    this.timeout.unsubscribe();
    this.timeout = null;
  }

  private tick() {
    this.remainingSec--;
    this.emit(TimerClockEvents.TICK, this.remainingSec);

    if (this.remainingSec <= 0) {
      this.remainingSec = 0;
      this.stop();
      this.emit(TimerClockEvents.OVER);
    }
  }
}

export default TimerClock;
