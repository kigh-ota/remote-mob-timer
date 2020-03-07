import { Subscription, interval } from 'rxjs';

class TimerClock {
  private timeout: Subscription | null;
  private remainingSec: number;
  private onTick: (sec: number) => void;
  private onOver: () => void;

  constructor(onTick?: (sec: number) => void, onOver?: () => void) {
    this.timeout = null;
    this.remainingSec = 0;

    this.onTick = onTick || (() => {});
    this.onOver = onOver || (() => {});
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
    this.onTick(this.remainingSec);

    if (this.remainingSec <= 0) {
      this.remainingSec = 0;
      this.stop();
      this.onOver();
    }
  }
}

export default TimerClock;
