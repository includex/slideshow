var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var slide = require('./routes/slide');
var multer  = require('multer')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(multer({ dest: './uploads/'}))

app.use('/files', express.static('files'));
app.use('/public', express.static('public'));

app.use('/', routes);
app.use('/users', users);
app.use('/slide', slide);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;


var server = app.listen(30000, function(){
  var host = server.address().address;
  var port = server.address().port;

  console.log('ex : %s %s', host, port);
});

server.timeout = 20000;

var io = require('socket.io').listen(server);

io.sockets.on('connection',function(socket){
  console.log('Message from client');
  socket.emit('sign',{msg:'Welcome !'});
  socket.on('fromclient',function(data){
    socket.broadcast.emit('toclient',data); // 자신을 제외하고 다른 클라이언트에게 보냄
    socket.emit('toclient',data); // 해당 클라이언트에게만 보냄. 다른 클라이언트에 보낼려면?
    console.log('Message from client :'+data.msg);
  })
});