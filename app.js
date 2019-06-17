var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const Timer = require('./timer');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
app.use('/users', usersRouter);

const timer = new Timer(handleTick);
timer.setTime(0, 10);
timer.start();
app.get('/', (req, res, next) => {
  const { min, sec } = timer.getTime();
  res.render('timer', { min, sec });
});

let clientId = 0;
let clients = {};

app.get('/events', (req, res) => {
  req.socket.setTimeout(86400);
  res.writeHead(200, {
    // text/event-stream を追加
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive'
  });
  res.write('\n');
  (clientId => {
    clients[clientId] = res;
    req.on('close', () => {
      delete clients[clientId];
    });
  })(++clientId);
});

function handleTick(sec) {
  const msg = sec;
  console.log('Clients: ' + Object.keys(clients) + ' <- ' + msg);
  for (let clientId in clients) {
    // メッセージの送信 \n\nが必要
    clients[clientId].write('data: ' + msg + '\n\n');
  }
}

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

module.exports = app;
