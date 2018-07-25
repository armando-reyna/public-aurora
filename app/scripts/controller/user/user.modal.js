(function () {
  'use strict';

  var module = angular.module('aurora');

  module.controller('UserModalCtrl', [
    'CONSTANTS', '$rootScope', '$scope', '$sessionStorage', '$state', 'UserService', 'BranchService', 'Response', '$uibModalInstance', 'notiffy', 'user',
    function (CONSTANTS, $rootScope, $scope, $sessionStorage, $state, UserService, BranchService, Response, $uibModalInstance, notiffy, user) {

      var vm = this;

      vm.userToken = $sessionStorage.userToken;

      if (user) {
        vm.action = 'Modificar';
        vm.user = user;
        vm.user.update = true;
      } else {
        vm.action = 'Agregar';
        vm.user = {
          update: false
        };
      }

      vm.loadRoles = function () {
        vm.loading = true;
        UserService.getAllUserRoles().then(function () {
          vm.loading = false;
          if (!Response.roles) {
            notiffy.error('Error al cargar lista de roles.');
          }
          vm.userRoles = [];
          angular.forEach(Response.roles, function (role, index) {
            if (role.id != CONSTANTS.ROLES.CLIENT && role.id != CONSTANTS.ROLES.LEAD) {
              vm.userRoles.push(role);
            }
          });
        }, function () {
          notiffy.error('Error al cargar lista de roles.');
          vm.loading = false;
        });
      };
      vm.loadRoles();

      vm.getBranches = function(){
        if(vm.userToken.role.id === CONSTANTS.ROLES.BRANCH_ADMIN){
          vm.branchList = [];
          vm.branchList.push(vm.userToken.branch);
        } else {
          vm.loading = true;
          var inactive = {
            inactive: false
          };
          BranchService.getAll(inactive).then(function () {
            vm.branchList = Response.branchList;
            vm.loading = false;
          }, function () {
            notiffy.error('Error al obtener la lista de sucursales.');
            vm.loading = false;
          });
        }
      };
      vm.getBranches();

      vm.save = function () {
        $scope.userForm.$setDirty(true);
        if ($scope.userForm.$valid) {
          vm.loading = true;
          UserService.save(vm.user).then(function () {
            vm.loading = false;
            $scope.userForm.user.$setValidity("duplicated", true);
            if (Response.saved.status == 'success') {
              $uibModalInstance.close();
              notiffy.success('Usuario guardado exitosamente.');
              if(vm.user.id == 0) {
                notiffy.success('Se ha enviado un correo a '+vm.user.user+' con la informaci\u00F3n de acceso.');
              }
            } else if (Response.saved.status == 'failure') {
              if(Response.saved.message == 'duplicated'){
                $scope.userForm.user.$setValidity("duplicated", false);
              }else {
                notiffy.error(Response.saved.message);
              }
            } else {
              notiffy.error('Error al guardar el usuario.');
            }
          }, function () {
            notiffy.error('Error al guardar el usuario.');
            vm.loading = false;
          });
        }
      };

      vm.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };

    }]);

})();