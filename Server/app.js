var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
const { Client } = require('node-osc');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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

const client = new Client('192.168.86.66', 8000);

const port = 3011;
var server = require('http').createServer(app);
var io = require('socket.io')(server);

io.on('connection', socket => {
    console.log('a user connected');

    socket.on('disconnect', reason => {
        console.log('user disconnected');
    });

    socket.on("controller-connection", data=>{
      console.log(data)
    });

    socket.on('axis', data=> {
      const axis = data.axis;
      const value = data.value;
      client.send(`/${axis}`, value, ()=>console.log(`${axis} – ${value}`));
    })

    socket.on('button', data => {
        const button = data.button;
        const pressed = data.pressed;
        client.send(`/${button}`, pressed, ()=>console.log(`${button} ${pressed ? "pressed" : "released"}`))
    });
});

server.listen(port);

module.exports = app;

