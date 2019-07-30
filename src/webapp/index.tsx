import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';

(() => {
  window.onload = () => {
    const rootEl = document.getElementById('root');
    ReactDOM.render(<App />, rootEl);
  };
})();
