export default class ConnectionTimeoutWatcher {
  private timeout: number | null;

  constructor(
    private readonly onDisconnected: Function,
    private readonly timeoutSec: number
  ) {
    this.timeout = null;
  }

  notify() {
    if (this.timeout) {
      window.clearTimeout(this.timeout);
    }
    console.debug('ConnectionTimeoutWatcher: notified');
    this.timeout = window.setTimeout(() => {
      this.onDisconnected();
      console.debug('ConnectionTimeoutWatcher: timeout');
    }, this.timeoutSec * 1000);
  }
}
