(function () {
  'use strict';

  var module = angular.module('aurora');

  module.controller('ProfileCtrl', [
    '$rootScope', '$scope', '$state', '$sessionStorage', '$timeout', 'UserService', 'Response', '$uibModal', 'confirmm', 'notiffy',
    function ($rootScope, $scope, $state, $sessionStorage, $timeout, UserService, Response, $uibModal, confirmm, notiffy) {

      var vm = this;
      vm.user = $sessionStorage.userToken;
      vm.refresh = function (userId) {
	      UserService.refreshUser(userId).then(function () {
	          vm.user = Response.user.data;
	      }, function () {
	          notiffy.error('Error al obtener la informaci\u00F3n del usuario.');
	      });
      };
      vm.refresh($sessionStorage.userToken.id);

      if($sessionStorage.newPayment){
        delete $sessionStorage.newPayment;
        confirmm.success("Gracias, su pago se ha procesado.");
      }

    }]);

})();