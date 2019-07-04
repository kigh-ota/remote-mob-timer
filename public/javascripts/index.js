(() => {
  let evtSource = null;

  window.onload = () => {
    Notification.requestPermission();
    evtSource = setupEventSource();
    setupButtons();
    fetch('/status')
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
    const logEvent = e => {
      console.log(`${e.type}: ${e.data}`);
    };
    evtSource.onmessage = evtSource.addEventListener('tick', e => {
      logEvent(e);
      const data = JSON.parse(e.data);
      updateTime(parseInt(data.sec));
    });
    evtSource.addEventListener('start', e => {
      logEvent(e);
      const data = JSON.parse(e.data);
      const sec = parseInt(data.sec);
      updateTime(sec);
      sendNotificationIfPossible(
        `Timer started by ${data.name} (${secondToDisplayTime(sec)})`
      );
    });
    evtSource.addEventListener('stop', e => {
      logEvent(e);
      const data = JSON.parse(e.data);
      const sec = parseInt(data.sec);
      updateTime(sec);
      sendNotificationIfPossible(
        `Timer stopped by ${data.name} (${secondToDisplayTime(sec)})`
      );
    });
    evtSource.addEventListener('over', e => {
      logEvent(e);
      sendNotificationIfPossible('Time ended');
    });

    return evtSource;
  }

  function getName() {
    return encodeURIComponent(document.querySelector('input#name-input').value);
  }

  function setupButtons() {
    [25, 20, 15, 10, 5].forEach(min => {
      document
        .getElementsByClassName(`start-${min}-min`)[0]
        .addEventListener('click', e => {
          fetch(`/reset?sec=${min * 60}&name=${getName()}`, { method: 'POST' });
        });
    });
    document
      .getElementsByClassName('toggle')[0]
      .addEventListener('click', e => {
        fetch(`/toggle?name=${getName()}`, { method: 'POST' })
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
