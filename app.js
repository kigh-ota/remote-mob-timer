var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');

const Timer = require('./timer');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const TIMER_SEC = 25 * 60;

const timer = new Timer(handleTick, handleOver, handleStart);

// Main Endpoint
app.get('/', (req, res, next) => {
  const { min, sec } = timer.getTime();
  res.render('index', { min, sec });
});

// Endpoint for Server-Sent Events
// Ref. https://qiita.com/akameco/items/c54af5af35ef9b500b54
let clientId = 0;
let clients = {};
app.get('/events', (req, res) => {
  req.socket.setTimeout(86400);
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-store'
  });
  res.write('\n');
  (clientId => {
    clients[clientId] = res;
    req.on('close', () => {
      delete clients[clientId];
    });
  })(++clientId);
});

function handleOver() {
  console.log('Clients: ' + Object.keys(clients) + ' <- Over');
  sendServerEvent('over', 'OVER');
}

function handleTick(sec) {
  console.log('Clients: ' + Object.keys(clients) + ' <- Tick');
  sendServerEvent('tick', sec);
}

function handleStart(sec) {
  console.log('Clients: ' + Object.keys(clients) + ' <- Start');
  sendServerEvent('start', sec);
}

function sendServerEvent(event, msg) {
  const payload = `event: ${event}\ndata: ${msg}\n\n`;
  for (let clientId in clients) {
    clients[clientId].write(payload);
  }
}

app.post('/reset', (req, res, next) => {
  timer.stop();
  timer.setTime(TIMER_SEC);
  timer.start();
  res.send('reset');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

timer.setTime(TIMER_SEC);
timer.start();

module.exports = app;
