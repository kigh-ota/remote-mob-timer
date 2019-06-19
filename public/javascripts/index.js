window.onload = () => {
  Notification.requestPermission();
  setupServeEventListeners();
  setupButtons();
  fetch('/time')
    .then(res => res.json())
    .then(json => {
      updateTime(json.time);
    });
};

function setupServeEventListeners() {
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
}

function setupButtons() {
  [25, 20, 15, 10, 5].forEach(min => {
    document
      .getElementsByClassName(`start-${min}-min`)[0]
      .addEventListener('click', e => {
        fetch(`/reset?sec=${min * 60}`, { method: 'POST' });
      });
  });
  document.getElementsByClassName('toggle')[0].addEventListener('click', e => {
    fetch(`/toggle`, { method: 'POST' })
      .then(res => res.json())
      .then(json => {
        updateTime(json.time);
      });
  });
}

function updateTime(sec) {
  document.getElementsByClassName('time')[0].textContent = secondToDisplayTime(
    sec
  );
}

function sendNotificationIfPossible(msg) {
  if (Notification.permission === 'granted') {
    new Notification('Simple Timer', {
      body: msg,
      renotify: true,
      tag: 'simple-timer'
    });
  }
}

function secondToDisplayTime(sec) {
  return (
    `${Math.floor(sec / 60)}`.padStart(2, '0') +
    ':' +
    `${sec % 60}`.padStart(2, '0')
  );
}
