(function () {
  'use strict';

  var module = angular.module('aurora');

  module.controller('CubicleModalCtrl', [
    'CONSTANTS', '$rootScope', '$scope', '$state', 'Response', 'CubicleService', 'BranchService', 'MockService',
    '$sessionStorage', '$uibModalInstance', 'notiffy', 'cubicle', 'nextOrder',
    function (CONSTANTS, $rootScope, $scope, $state, Response, CubicleService, BranchService, MockService,
              $sessionStorage, $uibModalInstance, notiffy, cubicle, nextOrder) {

      var vm = this;
      vm.user = $sessionStorage.userToken;

      if (cubicle) {
        vm.action = 'Modificar';
        vm.cubicle = cubicle;
        vm.cubicle.isUpdate = true;
      } else {
        vm.action = 'Agregar';
        //Mock Data
        if (CONSTANTS.ENV === CONSTANTS.ENVS.DEV) {
          MockService.get('cubicle').then(function () {
            vm.cubicle = Response.mock;
            vm.cubicle.sort = nextOrder;
          }, function () {
            notiffy.error('Error.');
          });
        } else {
          vm.cubicle = {sort: nextOrder};
        }
      }

      vm.loading = true;
      CubicleService.getCubicleTypes().then(function () {
        vm.cubicleTypes = Response.cubicleTypes;
        vm.loading = false;
      }, function () {
        notiffy.error('Error al obtener los tipos de cub\u00EDculos.');
        vm.loading = false;
      });

      vm.getBranches = function(){
        if(vm.user.role.id === CONSTANTS.ROLES.BRANCH_ADMIN){
          vm.branchList = [];
          vm.branchList.push(vm.user.branch);
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

      vm.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };

      vm.isDirty = function () {
        return $scope.cubicleForm.$dirty && $scope.submitted;
      };

      vm.save = function () {
        $scope.cubicleForm.$setDirty(true);
        $scope.submitted = true;
        //$scope.cubicleForm.user.$setValidity("duplicated", true);
        if ($scope.cubicleForm.$valid) {
          if (!vm.cubicle.active) {
            vm.cubicle.active = true;
          }
          CubicleService.save(vm.cubicle).then(function () {
            if (Response.saved.status == 'success') {
              $uibModalInstance.close();
              notiffy.success('Cub\u00EDculo guardado exitosamente.');
            } else if (Response.saved.status == 'failure') {
              if (Response.saved.message == 'duplicated') {
                $scope.cubicleForm.user.$setValidity("duplicated", false);
              } else {
                notiffy.error(Response.saved.message);
              }
            } else {
              notiffy.error('Error al guardar cubicle. Por favor intente nuevamente');
            }
          });
        }
      };

    }]);

})();