var express 		= require('express');

var app 			= express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

var chats = {general:[], room1:[], room2:[]};

app.use('/', express.static(__dirname + '/public/app'));

app.get('/chat', function(req, res){
  res.sendfile('index.html');
});

app.get('/msg', function(req, res) {
  	//Find
  	var msgs = chats[req.query.room.toLowerCase()];
	res.json(msgs);
});

io.on('connection', function(socket){
	var defaultRoom = 'general';
  	var rooms = ["general", "room1", "room2"];


  	socket.on('disconnect', function(){
    	console.log('user disconnected');
  	});

  	socket.emit('setup', {
	    rooms: rooms,
	    name: Math.floor(Math.random() * 100)
	});

  	socket.on('chat message', function(data){
  		console.log(data);
    	chats[data.room].push(data);
    	socket.broadcast.in(data.room).emit('chat message', data);
  	});

  	socket.on('new user', function(data) {
  		console.log('user connected', data);
  		data.newRoom = defaultRoom;
	    //New user joins the default room
	    socket.join(defaultRoom);
	    //Tell all those in the room that a new user joined
	    io.in(defaultRoom).emit('user joined', data);

  	});

  	//Listens for switch room
  	socket.on('switch room', function(data) {
    	//Handles joining and leaving rooms
    	console.log('switch room', data);
    	socket.leave(data.oldRoom);
    	socket.join(data.newRoom);
    	io.in(data.oldRoom).emit('user left', data);
    	io.in(data.newRoom).emit('user joined', data);

  	});
});

http.listen(3001, function(){
  console.log('listening on *:3001');
});