export default class ConnectionTimeoutWatcher {
  private onDisconnected: Function;
  private timeout: NodeJS.Timeout | null;
  static readonly TIMEOUT_SEC: number = 10;

  constructor(onDisconnected: Function) {
    this.onDisconnected = onDisconnected;
    this.timeout = null;
  }

  notify() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    console.debug('ConnectionTimeoutWatcher: notified');
    this.timeout = setTimeout(() => {
      this.onDisconnected();
      console.debug('ConnectionTimeoutWatcher: timeout');
    }, ConnectionTimeoutWatcher.TIMEOUT_SEC * 1000);
  }
}
