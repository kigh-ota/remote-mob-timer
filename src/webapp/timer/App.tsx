import * as React from 'react';
import TimeDisplay from './components/TimeDisplay';
import animals from './animals';
import IEvent, { EventType } from '../../common/IEvent';
import ReconnectingEventSource from './ReconnectingEventSource';
import { fromEvent, Subscription } from 'rxjs';
import { secondToDisplayTime } from './util';
import { useState, useEffect, useContext } from 'react';
import ResetButton from './components/ResetTimerButton';
import ToggleButton from './components/ToggleButton';
import NameInput from './components/NameInput';
import ConnectionStatus from './components/ConnectionStatus';
import EventHistory from './components/EventHistory';
import StatusJson from '../../common/StatusJson';
import { makeV1TimerUrl } from './UrlUtil';
import AppContext from './AppContext';

interface Props {
  timerName: string;
  reconnectingEventSource: ReconnectingEventSource;
  initialSec: number;
  initialEvents: IEvent[];
}

function randomName() {
  const i = Math.floor(Math.random() * Math.floor(animals.length));
  return animals[i];
}

function setStoredName(name: string) {
  window.localStorage.setItem('name', name);
}

export default function App(props: Props) {
  const [sec, setSec] = useState(props.initialSec);
  const [connected, setConnected] = useState(true);
  const [events, setEvents] = useState(props.initialEvents);

  const savedName = window.localStorage.getItem('name');
  const initialName = savedName || randomName();
  const [name, setNameState] = useState(initialName);
  setStoredName(name);

  const { notifier, clickSound, chimeSound } = useContext(AppContext);

  const updateEvents = () => {
    fetch(makeV1TimerUrl('status'))
      .then(res => res.json())
      .then((json: StatusJson) => {
        setEvents(json.eventHistory);
      });
  };

  const setupEventHandlers: (
    evtSource: EventTarget
  ) => Subscription[] = evtSource => {
    return [
      fromEvent(evtSource, EventType.TIMER_TICK).subscribe(
        (e: MessageEvent) => {
          const data = JSON.parse(e.data);
          setSec(parseInt(data.sec));
        }
      ),
      fromEvent(evtSource, EventType.TIMER_START).subscribe(
        (e: MessageEvent) => {
          const data = JSON.parse(e.data);
          const sec = parseInt(data.sec);
          setSec(sec);
          notifier.send(
            `Timer started by ${data.name} (${secondToDisplayTime(sec)})`
          );
          clickSound.play();
          updateEvents();
        }
      ),
      fromEvent(evtSource, EventType.TIMER_STOP).subscribe(
        (e: MessageEvent) => {
          const data = JSON.parse(e.data);
          const sec = parseInt(data.sec);
          setSec(sec);
          notifier.send(
            `Timer stopped by ${data.name} (${secondToDisplayTime(sec)})`
          );
          clickSound.play();
          updateEvents();
        }
      ),
      fromEvent(evtSource, EventType.TIMER_OVER).subscribe(() => {
        notifier.send('Time ended');
        chimeSound.play();
        updateEvents();
      }),
      fromEvent(evtSource, 'connected').subscribe(() => setConnected(true)),
      fromEvent(evtSource, 'disconnected').subscribe(() => setConnected(false)),
    ];
  };

  useEffect(() => {
    document.title = secondToDisplayTime(sec);
    const subs = setupEventHandlers(props.reconnectingEventSource);
    return () => {
      subs.forEach(sub => sub.unsubscribe());
    };
  });

  function getName() {
    return encodeURIComponent(name);
  }

  const resetButtons = [25, 20, 15, 10, 5].map(min => (
    <ResetButton key={min} min={min} getName={getName.bind(this)} />
  ));

  return (
    <React.Fragment>
      <h1>{props.timerName}</h1>
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
}
