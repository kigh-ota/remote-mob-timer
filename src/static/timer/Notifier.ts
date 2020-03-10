export default class Notifier {
  private readonly supported: boolean;

  constructor() {
    this.supported = 'Notification' in window;
    if (this.supported) {
      Notification.requestPermission();
    }
  }

  public send(msg: string, timerName: string) {
    if (!this.supported) {
      return;
    }
    if (Notification.permission === 'granted') {
      const n = new Notification(timerName, {
        body: msg,
        renotify: true,
        tag: 'remote-mob-timer',
      });
      n.onclick = () => window.focus();
    }
  }
}
