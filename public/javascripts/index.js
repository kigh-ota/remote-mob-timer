console.log('HOGE');

const evtSource = new EventSource('/events/');
evtSource.onmessage = e => {
  console.log('onmessage: ', e.data);
  updateTime(parseInt(e.data));
};

function updateTime(sec) {
  document.getElementsByClassName('time')[0].textContent = `${Math.floor(
    sec / 60
  )}:${sec % 60}`;
}
