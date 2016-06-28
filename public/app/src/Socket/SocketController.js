(function(){

  angular
       .module('Socket')
       .controller('SocketController', [
          'SocketDataService', '$scope', '$mdSidenav', '$location', '$anchorScroll',
          SocketController
       ]);
       
  function SocketController( SocketData, $scope, $mdSidenav, $location, $anchorScroll ) {
    var self = this;

    self.scrollToMessage = scrollToMessage;
    self.sendMessage = sendMessage;
    self.collection = [];

    SocketData.on('chat message', function (data) {
      self.collection.push(data);
      self.scrollToMessage(self.collection.length -1);
    });

    function scrollToMessage ( index ) {
      var old = $location.hash();
      $location.hash(index);
      $anchorScroll();
      //reset to old to keep any additional routing logic from kicking in
      // $location.hash(old);
      // $location.hash(index);
      // $anchorScroll();
    }

    function sendMessage ( message ) {
      if ( !message || message.length < 1 ) return false;
      var data = {
        name: 'self', content: message
      };
      SocketData.emit('chat message', data);
      self.collection.push(data);
      self.scrollToMessage(self.collection.length -1);
      self.message = '';
      return false;
    }


    function toggleUsersList() {
      $mdSidenav('left').toggle();
    }
  }

})();
