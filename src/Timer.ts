module.exports = class Timer {
  private timeout: NodeJS.Timeout | null;
  private remainingSec: number;
  private onTick: (sec: number) => void;
  private onOver: () => void;

  constructor(onTick?, onOver?) {
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

  start() {
    if (this.isRunning()) {
      return;
    }
    this.timeout = setInterval(() => this.tick(), 1000);
  }

  stop() {
    if (!this.isRunning()) {
      return;
    }
    clearInterval(this.timeout);
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
};
