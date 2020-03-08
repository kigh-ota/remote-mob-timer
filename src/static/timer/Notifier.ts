export default class Notifier {
  constructor() {
    Notification.requestPermission();
  }

  public send(msg: string, timerName: string) {
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
