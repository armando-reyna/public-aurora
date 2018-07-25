(function () {
  'use strict';

  var module = angular.module('aurora');

  module.controller('RememberPasswordModalCtrl', [
    'CONSTANTS', '$rootScope', '$scope', '$state', 'UserService', 'Response', '$uibModalInstance', 'confirmm',
    function (CONSTANTS, $rootScope, $scope, $state, UserService, Response, $uibModalInstance, confirmm) {

      var vm = this;

      vm.send = function () {
        $scope.userForm.$setDirty(true);
        if ($scope.userForm.$valid) {
          vm.loading = true;
          UserService.requestresetpassword(vm.user).then(function () {
            vm.loading = false;
            $uibModalInstance.close();
            confirmm.success('Si el correo electrónico coincide con una cuenta existente, enviaremos los pasos para reestablecer su contraseña.');
          }, function () {
            vm.loading = false;
            notiffy.error('Error al restablecer contraseña.');
          });
        }
      };

      vm.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };

    }]);

})();