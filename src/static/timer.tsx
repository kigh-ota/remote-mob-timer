import ReconnectingEventSource from './timer/ReconnectingEventSource';
import Notifier from './timer/Notifier';
import StatusJson from '../common/StatusJson';
import App from './timer/App';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { makeV1TimerUrl, makeTimerUrl } from './timer/UrlUtil';
import AppContext from './timer/AppContext';

(() => {
  window.onload = () => {
    const reconnectingEventSource = new ReconnectingEventSource(
      makeTimerUrl('events'),
      10,
      20
    );
    const appContextValue = {
      bellSound: new Audio('/sounds/bell.mp3'),
      clickSound: new Audio('/sounds/click.mp3'),
      chimeSound: new Audio('/sounds/chime.mp3'),
      notifier: new Notifier(),
    };

    fetch(makeV1TimerUrl('status'))
      .then(res => res.json())
      .then((json: StatusJson) => {
        ReactDOM.render(
          <AppContext.Provider value={appContextValue}>
            <App
              timerName={json.timer.name}
              reconnectingEventSource={reconnectingEventSource}
              initialSec={json.timer.time}
              initialEvents={json.eventHistory}
            />
          </AppContext.Provider>,
          document.getElementById('root')
        );
      });
  };
})();
