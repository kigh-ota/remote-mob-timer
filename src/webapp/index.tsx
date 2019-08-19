import ReconnectingEventSource from './ReconnectingEventSource';
import Notifier from './Notifier';
import StatusJson from '../common/StatusJson';
import App from './App';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

(() => {
  window.onload = () => {
    const reconnectingEventSource = new ReconnectingEventSource(
      '/events/',
      10,
      20
    );
    const notifier = new Notifier();

    fetch('/status.json')
      .then(res => res.json())
      .then((json: StatusJson) => {
        ReactDOM.render(
          <App
            reconnectingEventSource={reconnectingEventSource}
            notifier={notifier}
            initialSec={json.timer.time}
            initialEvents={json.eventHistory}
          />,
          document.getElementById('root')
        );
      });
  };
})();
