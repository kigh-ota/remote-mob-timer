console.log('HOGE');

const evtSource = new EventSource('/events/');
evtSource.addEventListener('tick', e => {
  console.log('tick: ', e.data);
  updateTime(parseInt(e.data));
});

function updateTime(sec) {
  document.getElementsByClassName('time')[0].textContent = `${Math.floor(
    sec / 60
  )}:${sec % 60}`;
}
