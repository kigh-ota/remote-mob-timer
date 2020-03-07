import * as React from 'react';
import * as ReactDOM from 'react-dom';

(() => {
  window.onload = () => {
    fetch('/v1/timer/ids')
      .then(res => res.json())
      .then((json: string[]) => {
        ReactDOM.render(
          <nav>
            <h2>Choose Timer:</h2>
            <ul className="timer-list">
              {json.map(id => (
                <li key={id}>
                  <a href={`timer/${id}/`}>{id}</a>
                </li>
              ))}
            </ul>
          </nav>,
          document.getElementById('root')
        );
      });
  };
})();
