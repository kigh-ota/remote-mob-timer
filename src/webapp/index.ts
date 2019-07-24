import animals from './animals';
import { EventType } from '../common/IEvent';
import ReconnectingEventSource from './ReconnectingEventSource';
(() => {
  let evtSource: ReconnectingEventSource | null = null;

  window.onload = () => {
    Notification.requestPermission();
    evtSource = new ReconnectingEventSource(
      () => {
        document.querySelector('.connection-status').textContent = '';
      },
      () => {
        document.querySelector('.connection-status').textContent =
          'Disconnected. Trying to reconnect...';
      }
    );
    setupEventHandlers();
    setupTimerButtons();
    setupNameInput();
    fetch('/status.json')
      .then(res => res.json())
      .then(json => {
        updateTime(json.timer.time);
        updateHistoryList(json.eventHistory.reverse());
      });
  };

  function setupEventHandlers() {
    evtSource.addEventListener(EventType.TIMER_TICK, (e: MessageEvent) => {
      const data = JSON.parse(e.data);
      updateTime(parseInt(data.sec));
    });
    evtSource.addEventListener(EventType.TIMER_START, (e: MessageEvent) => {
      const data = JSON.parse(e.data);
      const sec = parseInt(data.sec);
      updateTime(sec);
      sendNotificationIfPossible(
        `Timer started by ${data.name} (${secondToDisplayTime(sec)})`
      );
    });
    evtSource.addEventListener(EventType.TIMER_STOP, (e: MessageEvent) => {
      const data = JSON.parse(e.data);
      const sec = parseInt(data.sec);
      updateTime(sec);
      sendNotificationIfPossible(
        `Timer stopped by ${data.name} (${secondToDisplayTime(sec)})`
      );
    });
    evtSource.addEventListener(EventType.TIMER_OVER, (e: MessageEvent) => {
      sendNotificationIfPossible('Time ended');
    });
  }

  function setupNameInput() {
    const input = getNameInput();
    input.addEventListener('change', e => {
      window.localStorage.setItem('name', (<HTMLInputElement>e.target).value);
    });
    const savedName = window.localStorage.getItem('name');
    const name = savedName || randomName();
    input.value = name;
    window.localStorage.setItem('name', name);
  }

  function randomName() {
    const i = Math.floor(Math.random() * Math.floor(animals.length));
    return animals[i];
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

  function updateHistoryList(list: object[]) {
    const listEl = document.getElementsByClassName('history-list')[0];
    listEl.innerHTML = '';
    list.forEach(h => {
      const item = document.createElement('li');
      item.textContent = JSON.stringify(h);
      listEl.appendChild(item);
    });
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
