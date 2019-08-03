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
import EventHistory from './components/EventHistory';

interface Props {
  reconnectingEventSource: ReconnectingEventSource;
  notifier: Notifier;
  initialSec: number;
  initialEvents: IEvent[];
}

const App: React.SFC<Props> = props => {
  const [sec, setSec] = useState(props.initialSec);
  const [connected, setConnected] = useState(true);
  const [events, setEvents] = useState(props.initialEvents);

  const savedName = window.localStorage.getItem('name');
  const initialName = savedName || randomName();
  const [name, setNameState] = useState(initialName);
  setStoredName(name);
  

  setupEventHandlers(props.reconnectingEventSource, props.notifier);

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

  function getName() {
    return encodeURIComponent(name);
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
        <ToggleButton getName={getName.bind(this)} setSec={setSec} />
      </div>
      <NameInput
        name={name}
        setName={n => {
          setNameState(n);
          setStoredName(n);
        }}
      />
      <ConnectionStatus connected={connected} />
      <EventHistory events={events} />
    </React.Fragment>
  );
};

function randomName() {
  const i = Math.floor(Math.random() * Math.floor(animals.length));
  return animals[i];
}

function setStoredName(name: string) {
  window.localStorage.setItem('name', name);
}

export default App;
