(function () {
  'use strict';

  var module = angular.module('aurora');

  module.controller('PasswordModalCtrl', [
    'CONSTANTS', '$rootScope', '$scope', '$state', 'UserService', 'Response', '$uibModalInstance', 'notiffy', 'askOldPassword', 'user',
    function (CONSTANTS, $rootScope, $scope, $state, UserService, Response, $uibModalInstance, notiffy, askOldPassword, user) {

      var vm = this;

      vm.askOldPassword = askOldPassword;
      vm.user = angular.copy(user);

      var oldPassword = angular.copy(vm.user.password);

      vm.user.oldPassword = '';
      vm.user.password = '';

      vm.save = function () {
        $scope.userForm.$setDirty(true);
        if ($scope.userForm.$valid) {
          var change = {
            id: vm.user.id,
            password: vm.user.password
          };
          UserService.changePassword(change).then(function () {
            if (Response.saved.status == 'success') {
              user.password = vm.user.password;
              notiffy.success('Contraseña cambiada exitosamente.');
              $uibModalInstance.close();
            } else if (Response.saved.status == 'failure') {
              notiffy.error(Response.saved.message);
            } else {
              notiffy.error('Error al cambiar la contraseña');
            }
          });
        }
      };

      $scope.$watch('vm.user.password', function (newVal, oldVal) {
        if (vm.user.password == oldPassword) {
          $scope.userForm.password.$setValidity("repeated", false);
        } else {
          $scope.userForm.password.$setValidity("repeated", true);
        }
      });

      if(askOldPassword){
        $scope.$watch('vm.user.oldPassword', function (newVal, oldVal) {
          if(vm.user.oldPassword){
            if (vm.user.oldPassword == oldPassword) {
              $scope.userForm.oldPassword.$setValidity("wrong", true);
            } else {
              $scope.userForm.oldPassword.$setValidity("wrong", false);
            }
          }
        });
      }

      $scope.$watch('vm.user.repeatPassword', function (newVal, oldVal) {
        if (vm.user.password == vm.user.repeatPassword) {
          $scope.userForm.repeatPassword.$setValidity("notEqual", true);
        } else {
          $scope.userForm.repeatPassword.$setValidity("notEqual", false);
        }
      });

      vm.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };

    }]);

})();