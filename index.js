var express 		= require('express');

var app 			= express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use('/', express.static(__dirname + '/public/app'));

app.get('/chat', function(req, res){
  res.sendfile('index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('chat message', function(msg){
    console.log('message: ' + msg.content);
    socket.broadcast.emit('chat message', {name: 'other', content: msg.content});
  });
});

http.listen(3001, function(){
  console.log('listening on *:3001');
});