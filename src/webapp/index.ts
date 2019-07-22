import { EventType } from '../common/IEvent';
(() => {
  class Reconnecter {
    private timeout: NodeJS.Timeout;
    static readonly REQUEST_INTERVAL_SEC: number = 20;

    constructor() {
      this.timeout = null;
    }

    private tryToReconnect() {
      if (evtSource) {
        evtSource.close();
        evtSource = null;
      }
      evtSource = setupEventSource();
    }

    public start() {
      this.stop();
      this.timeout = setInterval(
        () => this.tryToReconnect(),
        Reconnecter.REQUEST_INTERVAL_SEC * 1000
      );
    }

    public stop() {
      if (this.timeout) {
        clearInterval(this.timeout);
      }
    }
  }

  let evtSource: EventSource | null = null;
  let connectionTimeoutWatcher: ConnectionTimeoutWatcher | null = null;
  let reconnecter: Reconnecter = new Reconnecter();

  window.onload = () => {
    Notification.requestPermission();
    setupConnectionTimeoutWatcher();
    evtSource = setupEventSource();
    setupTimerButtons();
    setupNameInput();
    updateConnectionStatus(true);
    fetch('/status')
      .then(res => res.json())
      .then(json => updateTime(json.timer.time));
  };

  function updateConnectionStatus(isConnected: boolean) {
    const status = document.querySelector('.connection-status');
    if (isConnected) {
      status.textContent = '';
      reconnecter.stop();
    } else {
      status.textContent = 'Disconnected. Trying to reconnect...';
      reconnecter.start();
    }
  }

  function setupConnectionTimeoutWatcher() {
    connectionTimeoutWatcher = new ConnectionTimeoutWatcher(() => {
      updateConnectionStatus(false);
    });
    connectionTimeoutWatcher.notifyConnected();
  }

  class ConnectionTimeoutWatcher {
    private connected: boolean;
    private onDisconnected: Function;
    private timeout: NodeJS.Timeout | null;
    static readonly TIMEOUT_SEC: number = 10;

    constructor(onDisconnected: Function) {
      this.connected = true;
      this.onDisconnected = onDisconnected;
      this.timeout = null;
    }

    notifyConnected() {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.timeout = setTimeout(() => {
        this.connected = false;
        this.onDisconnected();
      }, ConnectionTimeoutWatcher.TIMEOUT_SEC * 1000);
    }
  }

  function setupNameInput() {
    const input = getNameInput();
    input.addEventListener('change', e => {
      window.localStorage.setItem('name', (<HTMLInputElement>e.target).value);
    });
    const savedName = window.localStorage.getItem('name');
    input.value = savedName || '';
  }

  function setupEventSource() {
    const evtSource = new EventSource('/events/');
    const common = (e: MessageEvent) => {
      console.log(`${e.type}: ${e.data}`);
      connectionTimeoutWatcher.notifyConnected();
      updateConnectionStatus(true);
    };
    evtSource.addEventListener(EventType.TIMER_TICK, (e: MessageEvent) => {
      common(e);
      const data = JSON.parse(e.data);
      updateTime(parseInt(data.sec));
    });
    evtSource.addEventListener(EventType.TIMER_START, (e: MessageEvent) => {
      common(e);
      const data = JSON.parse(e.data);
      const sec = parseInt(data.sec);
      updateTime(sec);
      sendNotificationIfPossible(
        `Timer started by ${data.name} (${secondToDisplayTime(sec)})`
      );
    });
    evtSource.addEventListener(EventType.TIMER_STOP, (e: MessageEvent) => {
      common(e);
      const data = JSON.parse(e.data);
      const sec = parseInt(data.sec);
      updateTime(sec);
      sendNotificationIfPossible(
        `Timer stopped by ${data.name} (${secondToDisplayTime(sec)})`
      );
    });
    evtSource.addEventListener(EventType.TIMER_OVER, (e: MessageEvent) => {
      common(e);
      sendNotificationIfPossible('Time ended');
    });
    evtSource.addEventListener(EventType.ALIVE, (e: MessageEvent) => {
      common(e);
    });

    return evtSource;
  }

  function getNameInput(): HTMLInputElement {
    return document.querySelector('input#name-input');
  }

  function getName() {
    return encodeURIComponent(getNameInput().value);
  }

  function setupTimerButtons() {
    [25, 20, 15, 10, 5].forEach(min => {
      document
        .getElementsByClassName(`start-${min}-min`)[0]
        .addEventListener('click', e => {
          fetch(`/reset?sec=${min * 60}&name=${getName()}`, { method: 'POST' });
        });
    });
    document
      .getElementsByClassName('toggle')[0]
      .addEventListener('click', e => {
        fetch(`/toggle?name=${getName()}`, { method: 'POST' })
          .then(res => res.json())
          .then(json => {
            updateTime(json.time);
          });
      });
  }

  function updateTime(sec: number) {
    document.getElementsByClassName(
      'time'
    )[0].textContent = secondToDisplayTime(sec);
  }

  function sendNotificationIfPossible(msg: string) {
    if (Notification.permission === 'granted') {
      const n = new Notification('Mob Timer', {
        body: msg,
        renotify: true,
        tag: 'mob-timer'
      });
      n.onclick = () => window.focus();
    }
  }

  function secondToDisplayTime(sec: number) {
    return (
      `${Math.floor(sec / 60)}`.padStart(2, '0') +
      ':' +
      `${sec % 60}`.padStart(2, '0')
    );
  }
})();
