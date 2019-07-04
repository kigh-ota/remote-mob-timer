(() => {
  let evtSource = null;

  window.onload = () => {
    Notification.requestPermission();
    evtSource = setupEventSource();
    setupButtons();
    fetch('/time')
      .then(res => res.json())
      .then(json => updateTime(json.time));
  };

  function getReconnectButton() {
    return document.querySelector('.reconnect');
  }

  function setupReconnectButton() {
    const button = getReconnectButton();
    button.addEventListener('click', handleClickReconnectButton);
    button.style = 'display: none;'; // FIXME
  }

  function handleClickReconnectButton() {
    if (evtSource) {
      evtSource.close();
      evtSource = null;
    }
    evtSource = setupEventSource();
  }

  // function updateReconnectButton() {
  //   const button = getReconnectButton();
  //   if (!evtSource || evtSource.readyState !== 1) {
  //     button.style = '';
  //   } else {
  //     button.style = 'display: none;';
  //   }
  // }

  function setupEventSource() {
    const evtSource = new EventSource('/events/');
    evtSource.addEventListener('tick', e => {
      console.log('tick: ', e.data);
      updateTime(parseInt(e.data));
    });
    evtSource.addEventListener('start', e => {
      console.log('start: ', e.data);
      const sec = parseInt(e.data);
      updateTime(sec);
      sendNotificationIfPossible(`Timer started (${secondToDisplayTime(sec)})`);
    });
    evtSource.addEventListener('stop', e => {
      console.log('stop: ', e.data);
      const sec = parseInt(e.data);
      updateTime(sec);
      sendNotificationIfPossible(`Timer stopped (${secondToDisplayTime(sec)})`);
    });
    evtSource.addEventListener('over', e => {
      console.log('over: ', e.data);
      sendNotificationIfPossible('Time ended');
    });

    return evtSource;
  }

  function setupButtons() {
    [25, 20, 15, 10, 5].forEach(min => {
      document
        .getElementsByClassName(`start-${min}-min`)[0]
        .addEventListener('click', e => {
          fetch(`/reset?sec=${min * 60}`, { method: 'POST' });
        });
    });
    document
      .getElementsByClassName('toggle')[0]
      .addEventListener('click', e => {
        fetch(`/toggle`, { method: 'POST' })
          .then(res => res.json())
          .then(json => {
            updateTime(json.time);
          });
      });
    setupReconnectButton();
  }

  function updateTime(sec) {
    document.getElementsByClassName(
      'time'
    )[0].textContent = secondToDisplayTime(sec);
  }

  function sendNotificationIfPossible(msg) {
    if (Notification.permission === 'granted') {
      const n = new Notification('Mob Timer', {
        body: msg,
        renotify: true,
        tag: 'mob-timer'
      });
      n.onclick = () => window.focus();
    }
  }

  function secondToDisplayTime(sec) {
    return (
      `${Math.floor(sec / 60)}`.padStart(2, '0') +
      ':' +
      `${sec % 60}`.padStart(2, '0')
    );
  }
})();
