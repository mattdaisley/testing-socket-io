(function(){

  angular
       .module('users')
       .controller('UserController', [
          'userService', '$scope', '$mdSidenav', '$mdBottomSheet', '$timeout', '$log', '$location', '$anchorScroll',
          UserController
       ]);

  /**
   * Main Controller for the Angular Material Starter App
   * @param $scope
   * @param $mdSidenav
   * @param avatarsService
   * @constructor
   */
  function UserController( userService, $scope, $mdSidenav, $mdBottomSheet, $timeout, $log, $location, $anchorScroll ) {
    var self = this;

    var socket = io();
    // $('form').submit(function(){
    //   socket.emit('chat message', $('#m').val());
    //   $('#m').val('');
    //   return false;
    // });
    socket.on('chat message', function(msg){
      self.users.push(msg);
      self.selectUser(self.users.length -1);
      $scope.$apply();
    });

    self.selected     = null;
    self.users        = [ ];
    self.selectUser   = selectUser;
    self.toggleList   = toggleUsersList;
    self.sendMessage  = sendMessage;
    self.makeContact  = makeContact;

    // Load all registered users

    userService
          .loadAllUsers()
          .then( function( users ) {
            self.users    = [].concat(users);
          });

    // *********************************
    // Internal methods
    // *********************************

    /**
     * Hide or Show the 'left' sideNav area
     */
    function toggleUsersList() {
      $mdSidenav('left').toggle();
    }

    /**
     * Select the current avatars
     * @param menuId
     */
    function selectUser ( index ) {
      // self.topIndex = index;
      // var idToScroll = index;
      $location.hash(index);
      $anchorScroll();
      // });
      // self.selected = angular.isNumber(user) ? $scope.users[user] : user;
    }

    function sendMessage ( message ) {
      socket.emit('chat message', message);
      self.users.push({name: 'self', content: message});
      self.selectUser(self.users.length -1);
      self.message = '';
      return false;
    }

    /**
     * Show the Contact view in the bottom sheet
     */
    function makeContact(selectedUser) {

        $mdBottomSheet.show({
          controllerAs  : "vm",
          templateUrl   : './src/users/view/contactSheet.html',
          controller    : [ '$mdBottomSheet', ContactSheetController],
          parent        : angular.element(document.getElementById('content'))
        }).then(function(clickedItem) {
          $log.debug( clickedItem.name + ' clicked!');
        });

        /**
         * User ContactSheet controller
         */
        function ContactSheetController( $mdBottomSheet ) {
          this.user = selectedUser;
          this.items = [
            { name: 'Phone'       , icon: 'phone'       , icon_url: 'assets/svg/phone.svg'},
            { name: 'Twitter'     , icon: 'twitter'     , icon_url: 'assets/svg/twitter.svg'},
            { name: 'Google+'     , icon: 'google_plus' , icon_url: 'assets/svg/google_plus.svg'},
            { name: 'Hangout'     , icon: 'hangouts'    , icon_url: 'assets/svg/hangouts.svg'}
          ];
          this.contactUser = function(action) {
            // The actually contact process has not been implemented...
            // so just hide the bottomSheet

            $mdBottomSheet.hide(action);
          };
        }
    }

  }

})();
