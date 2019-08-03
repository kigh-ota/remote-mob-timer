import animals from './animals';
import IEvent, { EventType } from '../common/IEvent';
import ReconnectingEventSource from './ReconnectingEventSource';
import Notifier from './Notifier';
import { fromEvent } from 'rxjs';
import StatusJson from '../common/StatusJson';
import App from './App';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

(() => {
  window.onload = () => {
    const evtSource = new ReconnectingEventSource(
      '/events/',
      () => {
        document.querySelector('.connection-status').textContent = '';
      },
      () => {
        document.querySelector('.connection-status').textContent =
          'Disconnected. Trying to reconnect...';
      },
      10,
      20
    );
    const notifier = new Notifier();
    setupEventHandlers(evtSource, notifier);
    setupTimerButtons();
    setupNameInput();
    fetch('/status.json')
      .then(res => res.json())
      .then((json: StatusJson) => {
        updateTime(json.timer.time);
        updateHistoryList(json.eventHistory.reverse());
      });

    ReactDOM.render(<App />, document.getElementById('root'));
  };

  function setupEventHandlers(evtSource: EventTarget, notifier: Notifier) {
    fromEvent(evtSource, EventType.TIMER_TICK).subscribe((e: MessageEvent) => {
      const data = JSON.parse(e.data);
      updateTime(parseInt(data.sec));
    });
    fromEvent(evtSource, EventType.TIMER_START).subscribe((e: MessageEvent) => {
      const data = JSON.parse(e.data);
      const sec = parseInt(data.sec);
      updateTime(sec);
      notifier.send(
        `Timer started by ${data.name} (${secondToDisplayTime(sec)})`
      );
    });
    fromEvent(evtSource, EventType.TIMER_STOP).subscribe((e: MessageEvent) => {
      const data = JSON.parse(e.data);
      const sec = parseInt(data.sec);
      updateTime(sec);
      notifier.send(
        `Timer stopped by ${data.name} (${secondToDisplayTime(sec)})`
      );
    });
    fromEvent(evtSource, EventType.TIMER_OVER).subscribe((e: MessageEvent) => {
      notifier.send('Time ended');
    });
  }

  function setupNameInput() {
    const input = getNameInput();
    input.addEventListener('change', e => {
      window.localStorage.setItem('name', (e.target as HTMLInputElement).value);
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

  function updateHistoryList(list: IEvent[]) {
    const listEl = document.getElementsByClassName('history-list')[0];
    listEl.innerHTML = '';
    list.forEach(h => {
      const item = document.createElement('li');
      item.textContent = JSON.stringify(h);
      listEl.appendChild(item);
    });
  }

  function secondToDisplayTime(sec: number) {
    return (
      `${Math.floor(sec / 60)}`.padStart(2, '0') +
      ':' +
      `${sec % 60}`.padStart(2, '0')
    );
  }
})();
