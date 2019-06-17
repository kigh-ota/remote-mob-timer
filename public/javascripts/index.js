window.onload = () => {
  Notification.requestPermission();

  const evtSource = new EventSource('/events/');
  evtSource.addEventListener('tick', e => {
    console.log('tick: ', e.data);
    updateTime(parseInt(e.data));
  });
  evtSource.addEventListener('over', e => {
    console.log('over: ', e.data);
    if (Notification.permission === 'granted') {
      new Notification('Time is Over!');
    }
  });

  function updateTime(sec) {
    document.getElementsByClassName('time')[0].textContent = `${Math.floor(
      sec / 60
    )}:${sec % 60}`;
  }

  // RESET button
  document
    .getElementsByClassName('reset-button')[0]
    .addEventListener('click', e => {
      fetch('/reset', { method: 'POST' });
    });
};
