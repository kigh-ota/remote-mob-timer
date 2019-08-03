import * as React from 'react';
import TimeDisplay from './TimeDisplay';
import animals from './animals';
import IEvent, { EventType } from '../common/IEvent';
import ReconnectingEventSource from './ReconnectingEventSource';
import Notifier from './Notifier';
import { fromEvent } from 'rxjs';
import StatusJson from '../common/StatusJson';
import { secondToDisplayTime } from './util';
import { useState } from 'react';

interface Props {
  reconnectingEventSource: ReconnectingEventSource;
}

const App: React.SFC<Props> = props => {
  const [sec, setSec] = useState(0);

  const notifier = new Notifier();
  setupEventHandlers(props.reconnectingEventSource, notifier);
  setupTimerButtons();
  setupNameInput();
  fetch('/status.json')
    .then(res => res.json())
    .then((json: StatusJson) => {
      setSec(json.timer.time);
      updateHistoryList(json.eventHistory.reverse());
    });

  function setupEventHandlers(evtSource: EventTarget, notifier: Notifier) {
    fromEvent(evtSource, EventType.TIMER_TICK).subscribe((e: MessageEvent) => {
      const data = JSON.parse(e.data);
      setSec(parseInt(data.sec));
    });
    fromEvent(evtSource, EventType.TIMER_START).subscribe((e: MessageEvent) => {
      const data = JSON.parse(e.data);
      const sec = parseInt(data.sec);
      setSec(sec);
      notifier.send(
        `Timer started by ${data.name} (${secondToDisplayTime(sec)})`
      );
    });
    fromEvent(evtSource, EventType.TIMER_STOP).subscribe((e: MessageEvent) => {
      const data = JSON.parse(e.data);
      const sec = parseInt(data.sec);
      setSec(sec);
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
            setSec(json.time);
          });
      });
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

  return <TimeDisplay sec={sec} />;
};

export default App;
