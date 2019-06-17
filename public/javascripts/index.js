window.onload = () => {
  Notification.requestPermission();

  const evtSource = new EventSource('/events/');
  evtSource.addEventListener('tick', e => {
    console.log('tick: ', e.data);
    updateTime(parseInt(e.data));
  });
  evtSource.addEventListener('start', e => {
    console.log('start: ', e.data);
    updateTime(parseInt(e.data));
    sendNotificationIfPossible('Someone started timer!');
  });
  evtSource.addEventListener('over', e => {
    console.log('over: ', e.data);
    sendNotificationIfPossible('Time is over!');
  });

  function updateTime(sec) {
    document.getElementsByClassName('time')[0].textContent = `${Math.floor(
      sec / 60
    )}:${sec % 60}`;
  }

  function sendNotificationIfPossible(msg) {
    if (Notification.permission === 'granted') {
      new Notification(msg);
    }
  }

  // RESET button
  document
    .getElementsByClassName('reset-button')[0]
    .addEventListener('click', e => {
      fetch('/reset', { method: 'POST' });
    });
};
