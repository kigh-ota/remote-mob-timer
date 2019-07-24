export default class IntervalTimer {
  private timeout: NodeJS.Timeout;

  constructor(
    private readonly callback: () => void,
    private readonly intervalSec: number
  ) {
    this.timeout = null;
  }

  public start() {
    this.stop();
    this.timeout = setInterval(() => {
      console.debug('IntervalTimer: timeout');
      this.callback();
    }, this.intervalSec * 1000);
  }

  public stop() {
    if (this.timeout) {
      clearInterval(this.timeout);
    }
  }
}
