var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();



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


const port = 3011;
var server = require('http').createServer(app);
var io = require('socket.io')(server);

const dgram = require('dgram');
const osc = dgram.createSocket('udp4');
const target_ip = "192.168.86.99"
const target_port = 9000;

const midiAxes = {
  'LeftStickX': ['control', 0x01], // "Spicy" CC for Dreams
  'LeftStickY': ['pitch', 0x00], //pitch bend (LSBs so leave 0)
  'RightStickX': ['control', 0x0C], // X CC for Dreams
  'RightStickY': ['control', 0x0D], // Y CC for Dreams
}


const midiToOsc = (portid, type, number, value) => {
  const types = {
    'noteOn': 0x90,
    'noteOff': 0x80,
    'control': 0xB0,
    'pitch': 0xE0
  };
  const header = Buffer.from("/dreams\0\,m\0\0");
  const midi = Buffer.from([portid, types[type], number, value]);
  const bufferArray = [header, midi]; //
  const packet = Buffer.concat(bufferArray);
  console.debug(packet);
  osc.send(packet, 0, packet.length, target_port, target_ip, (e) => {console.debug(e)});
}

io.on('connection', socket => {
    console.log('a user connected');

    socket.on('disconnect', reason => {
        console.log('user disconnected');
    });

    socket.on("controller-connection", data=>{
      console.log(data)
    });

    socket.on('axis', data=> {
      const midiControlType = midiAxes[data.axis][0];
      const midiControlNumber = midiAxes[data.axis][1];
      const value = data.value;
      midiToOsc(0x00, midiControlType, midiControlNumber, value);
    })

    socket.on('button', data => {
        const note = data.button;
        const state = data.pressed ? 'noteOn' : 'noteOff';
        midiToOsc(0x00, state, note, 64);
    });

    socket.on('test', data => {
      const header = Buffer.from("/dreams\0\,m\0\0"); //dreams address with ,m midi type tag string and null characters
      const midi = Buffer.from([0x00, 0x90, 0x3c, 0x7f]); //port ID 0, noteon message, C4, 127 velocity
      const bufferArray = [header, midi]; //
      const packet = Buffer.concat(bufferArray);
      console.debug(packet);
      osc.send(packet, 0, packet.length, target_port, target_ip, () => {});
      
    })
});


server.listen(port);

module.exports = app;

