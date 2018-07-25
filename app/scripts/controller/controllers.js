(function() {
  'use strict';

  var module = angular.module('aurora');

  module.controller('MainCtrl', ['$scope', '$state', '$sessionStorage', '$rootScope', '$window', '$uibModal',
    'UserService', 'Response', 'notiffy',
    function ($scope, $state, $sessionStorage, $rootScope, $window, $uibModal, UserService, Response, notiffy){

      var vm = this;

      vm.refresh = function (userId) {
        UserService.refreshUser(userId).then(function () {
          vm.user = Response.user.data;
        }, function () {
          notiffy.error('Error al obtener la informaci\u00F3n del usuario.');
        });
      };

      if($sessionStorage.userToken && $sessionStorage.userToken.id){
        vm.token = $sessionStorage.userToken;
        vm.refresh($sessionStorage.userToken.id);
      }

      vm.logout = function(){
        delete $sessionStorage.userToken;
        delete $sessionStorage.notifications;
        $state.go("login");
      };

      vm.toggled = function(open) {
        if(!open){
          angular.forEach($rootScope.notifications, function(notification) {
            notification.unread = false;
          });
        }
      };

      vm.showChangePassword = function(){
        var modalInstance = $uibModal.open({
          templateUrl: 'views/user/password.modal.html',
          controller: 'PasswordModalCtrl',
          controllerAs: 'vm',
          resolve: {
            askOldPassword: function () {
              return true;
            },
            user: function () {
              return vm.token;
            }
          }
        });
        modalInstance.result.then(function () {

        }, function () {

        });
      };

    }
  ]);

})();