export default class ConnectionTimeoutWatcher {
  private onDisconnected: Function;
  private timeout: NodeJS.Timeout | null;
  static readonly TIMEOUT_SEC: number = 10;

  constructor(onDisconnected: Function) {
    this.onDisconnected = onDisconnected;
    this.timeout = null;
  }

  notifyConnected() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      this.onDisconnected();
    }, ConnectionTimeoutWatcher.TIMEOUT_SEC * 1000);
  }
}
