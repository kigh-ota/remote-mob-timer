import animals from './animals';
import IEvent, { EventType } from '../common/IEvent';
import ReconnectingEventSource from './ReconnectingEventSource';
import Notifier from './Notifier';
import { fromEvent } from 'rxjs';
import StatusJson from '../common/StatusJson';
import App from './App';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { secondToDisplayTime } from './util';

(() => {
  window.onload = () => {
    const reconnectingEventSource = new ReconnectingEventSource(
      '/events/',
      () => {},
      () => {},
      10,
      20
    );

    ReactDOM.render(
      <App reconnectingEventSource={reconnectingEventSource} />,
      document.getElementById('root')
    );
  };
})();
