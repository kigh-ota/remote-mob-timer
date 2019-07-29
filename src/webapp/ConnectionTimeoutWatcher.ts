export default class ConnectionTimeoutWatcher {
  private onDisconnected: Function;
  private timeout: number | null;
  static readonly TIMEOUT_SEC: number = 10;

  constructor(onDisconnected: Function) {
    this.onDisconnected = onDisconnected;
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
    }, ConnectionTimeoutWatcher.TIMEOUT_SEC * 1000);
  }
}
