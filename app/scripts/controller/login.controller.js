(function () {
  'use strict';

  var loginModule = angular.module('aurora');

  loginModule.controller('LoginCtrl', [
    'CONSTANTS', '$rootScope', '$scope', '$state', '$sessionStorage', '$timeout', 'UserService', 'Response', '$uibModal',
    'notiffy', 'UtilService', 'AppointmentService', '$http', '$stateParams', 'confirmm',
    function (CONSTANTS, $rootScope, $scope, $state, $sessionStorage, $timeout, UserService, Response, $uibModal,
              notiffy, UtilService, AppointmentService, $http, $stateParams, confirmm) {

      var vm = this;

      var checkResetPassword = function(){
        if($stateParams && $stateParams.id && $stateParams.key){
          var passwordDto = {
            id: $stateParams.id,
            password: $stateParams.key
          };
          $scope.$parent.main.loading = true;
          UserService.resetPassword(passwordDto).then(function() {
            $scope.$parent.main.loading = false;
            vm.reset = Response.reset;
            if(vm.reset){
              confirmm.success('Hemos enviado un correo con los pasos para restablecer su contraseña.');
            }
          }, function () {
            $scope.$parent.main.loading = false;
          });
        }
      };

      checkResetPassword();

      var checkCancelApt = function(){
        if($stateParams && $stateParams.apt && $stateParams.cancelKey){
          var aptDto = {
            id: $stateParams.apt,
            cancelKey: $stateParams.cancelKey
          };
          $scope.$parent.main.loading = true;
          AppointmentService.cancel(aptDto).then(function() {
            $scope.$parent.main.loading = false;
            vm.cancelled = Response.cancelled;
            if(vm.cancelled === CONSTANTS.APT.CANCELED){
              confirmm.success('La cita se ha cancelado exitosamente.');
            } else if(vm.cancelled === CONSTANTS.APT.ALREADY_CANCELED){
              confirmm.error('La cita se ya se canceló anteriormente.');
            } else if(vm.cancelled === CONSTANTS.APT.ERROR_DATE){
              confirmm.error('La cita no se ha cancelado, la fecha para cancelar ha expirado.');
            }
          }, function () {
            $scope.$parent.main.loading = false;
          });
        }
      };

      checkCancelApt();

      var invalid = function(){
        vm.loginForm.user.$dirty = true;
        vm.loginForm.password.$dirty = true;
        return vm.loginForm.user.$invalid
          || vm.loginForm.password.$invalid;
      };

      var showChangePassword = function(){
        var modalInstance = $uibModal.open({
          templateUrl: 'views/user/password.modal.html',
          controller: 'PasswordModalCtrl',
          controllerAs: 'vm',
          resolve: {
            askOldPassword: function () {
              return false;
            },
            user: function () {
              return vm.token;
            }
          }
        });
        modalInstance.result.then(function () {
          $sessionStorage.userToken = vm.token;
          $state.go("index.main");
        }, function () {

        });
      };

      vm.loginAction = function(){
        if(!invalid()){
          $scope.$parent.main.loading = true;
          // authService.login(vm.user.user, vm.user.password).then(function() {
          //   $scope.$parent.main.loading = false;
          //   if($sessionStorage.token){
          //     $scope.$parent.main.loading = true;

              UserService.login(vm.user).then(function() {
                $scope.$parent.main.loading = false;
                if (Response.user.status == 'failure' && Response.user.message) {
                  vm.loginError = true;
                  vm.loginMessage = Response.user.message;
                } else {
                  vm.token = Response.user.data;
                  UtilService.updateHeaderInfo(Response.user.data);
                }
                if(vm.token){
                  $scope.$parent.main.loading = true;
                  UserService.getMenu(vm.token.role.menu).then(function() {
                    $scope.$parent.main.loading = false;
                    vm.token.role.menu = Response.menu;
                    // console.log(vm.token);
                    if(vm.token.passwordChanged){
                      $sessionStorage.reload = true;
                      $sessionStorage.userToken = vm.token;
                      $state.go("index.main");
                    }else {
                      showChangePassword();
                    }
                  });
                }else if (!vm.userInactive) {
                  vm.loginError = true;
                }
              });

            // } else {
            //   vm.loginError = true;
            //   vm.loginMessage = 'Datos incorrectos.';
            // }
          // }, function(){
          //   vm.loginMessage = 'Datos incorrectos.';
          //   $scope.$parent.main.loading = false;
          //   vm.loginError = true;
          // });
        }
      };

      vm.showRememberPassword = function(){
        var modalInstance = $uibModal.open({
          templateUrl: 'views/user/remember.modal.html',
          controller: 'RememberPasswordModalCtrl',
          controllerAs: 'vm',
          resolve: {}
        });
        modalInstance.result.then(function (email) {

        }, function () {

        });
      };

    }]);

})();