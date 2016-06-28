(function(){
  'use strict';

  angular.module('Socket')
         .service('SocketDataService', ['$q', 'socketFactory', SocketData]);

  /**
   * Users DataService
   * Uses embedded, hard-coded data model; acts asynchronously to simulate
   * remote data service call(s).
   *
   * @returns {{loadAll: Function}}
   * @constructor
   */
  function SocketData($q, socketFactory){

    var serverBaseUrl = 'http://localhost:3001';

    var myIoSocket = io.connect(serverBaseUrl);

    var socket = socketFactory({
        ioSocket: myIoSocket
    });

    return socket;
  };

})();
