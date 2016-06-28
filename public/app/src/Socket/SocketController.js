(function(){

  angular
       .module('Socket')
       .controller('SocketController', [
          'SocketDataService', '$scope', '$mdSidenav', '$location', '$http', '$anchorScroll',
          SocketController
       ]);
       
  function SocketController( SocketData, $scope, $mdSidenav, $location, $http, $anchorScroll ) {
    var self = this;

    self.scrollToMessage = scrollToMessage;
    self.scrollToBottom = scrollToBottom;
    self.sendMessage = sendMessage;
    self.switchRoom = switchRoom;
    self.isOwner = isOwner;
    self.collection = [];
    self.rooms = [];
    self.room = '';
    self.name = '';

    SocketData.emit('new user', {
        room: 'general'
    });

    SocketData.on('setup', function (data) {
      self.rooms = [].concat(data.rooms);
      self.name = data.name;
    });

    SocketData.on('chat message', function (data) {
      self.collection.push(data);
      // self.scrollToBottom();
    });

    SocketData.on('user joined', function (data) {
      console.log('message');
      self.room = data.newRoom;
      //Fetch the new rooms messages
      $http.get('http://127.0.0.1:3001/msg?room=' + self.room).success(function (msgs) {
        self.collection = msgs;
        self.scrollToMessage(msgs.length - 1);
      });
    });

    function scrollToMessage ( index ) {
      var old = $location.hash();
      $location.hash(index);
      console.log($location.hash(), index, self.collection.length);
      $anchorScroll();
    }

    function isOwner ( name ) {
      return name == self.name;
    }

    function scrollToBottom () {
      self.scrollToMessage(self.collection.length -1);
    }

    function switchRoom ( room ) {
      var data = {
        oldRoom: self.room,
        newRoom: room
      }
      SocketData.emit('switch room', data);
      self.room = room;
    }

    function sendMessage ( message ) {
      if ( !message || message.length < 1 ) return false;
      var data = {
        name: self.name, 
        room: self.room,
        content: message
      };
      SocketData.emit('chat message', data);
      self.collection.push(data);
      // self.scrollToBottom();
      self.message = '';
      return false;
    }


    function toggleUsersList() {
      $mdSidenav('left').toggle();
    }
  }

})();
