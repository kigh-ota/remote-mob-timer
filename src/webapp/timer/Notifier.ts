export default class Notifier {
  constructor() {
    Notification.requestPermission();
  }

  public send(msg: string) {
    if (Notification.permission === 'granted') {
      const n = new Notification('Mob Timer', {
        body: msg,
        renotify: true,
        tag: 'mob-timer',
      });
      n.onclick = () => window.focus();
    }
  }
}
