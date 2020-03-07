import * as React from 'react';
import * as ReactDOM from 'react-dom';
import TimerJson from '../common/TimerJson';

(() => {
  window.onload = () => {
    fetch('/v1/timers')
      .then(res => res.json())
      .then((json: TimerJson[]) => {
        ReactDOM.render(
          <nav>
            <h2>Choose Timer:</h2>
            <ul className="timer-list">
              {json.map(timer => (
                <li key={timer.id}>
                  <a href={`timer/${timer.id}/`}>{timer.name}</a>
                </li>
              ))}
            </ul>
          </nav>,
          document.getElementById('root')
        );
      });
  };
})();
