import * as React from 'react';
import TimeDisplay from './components/TimeDisplay';
import animals from './animals';
import IEvent, { EventType } from '../common/IEvent';
import ReconnectingEventSource from './ReconnectingEventSource';
import Notifier from './Notifier';
import { fromEvent } from 'rxjs';
import StatusJson from '../common/StatusJson';
import { secondToDisplayTime } from './util';
import { useState } from 'react';
import ResetButton from './components/ResetTimerButton';
import ToggleButton from './components/ToggleButton';
import NameInput from './components/NameInput';
import ConnectionStatus from './components/ConnectionStatus';

interface Props {
  reconnectingEventSource: ReconnectingEventSource;
}

const App: React.SFC<Props> = props => {
  const [sec, setSec] = useState(0);

  const savedName = window.localStorage.getItem('name');
  const initialName = savedName || randomName();
  const [name, setNameState] = useState(initialName);
  setStoredName(name);

  const [connected, setConnected] = useState(true);

  const notifier = new Notifier();
  setupEventHandlers(props.reconnectingEventSource, notifier);
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

    fromEvent(evtSource, 'connected').subscribe(e => setConnected(true));
    fromEvent(evtSource, 'disconnected').subscribe(e => setConnected(false));
  }

  function setStoredName(name: string) {
    window.localStorage.setItem('name', name);
  }

  function getName() {
    return encodeURIComponent(name);
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

  const resetButtons = [25, 20, 15, 10, 5].map(min => (
    <ResetButton min={min} getName={getName.bind(this)} />
  ));

  return (
    <React.Fragment>
      <TimeDisplay sec={sec} />
      <div>
        <span>START:</span>
        {resetButtons}
      </div>
      <div>
        <ToggleButton getName={getName} setSec={setSec} />
      </div>
      <NameInput
        name={name}
        setName={n => {
          setNameState(n);
          setStoredName(n);
        }}
      />
      <ConnectionStatus connected={connected} />
    </React.Fragment>
  );
};

function randomName() {
  const i = Math.floor(Math.random() * Math.floor(animals.length));
  return animals[i];
}

export default App;
