(function(){
  'use strict';

  angular.module('Socket')
         .service('SocketDataService', ['socketFactory', SocketData]);


  function SocketData(socketFactory){

    var serverBaseUrl = 'http://localhost:3001';

    var myIoSocket = io.connect(serverBaseUrl);

    var socket = socketFactory({
        ioSocket: myIoSocket
    });

    return socket;
  };

})();
