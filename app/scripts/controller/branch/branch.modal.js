(function () {
  'use strict';

  var module = angular.module('aurora');

  module.controller('BranchModalCtrl', [
    'CONSTANTS', '$rootScope', '$scope', '$state', 'Response', 'BranchService', 'MockService', '$uibModalInstance', 'notiffy', 'branch', 'nextOrder',
    function (CONSTANTS, $rootScope, $scope, $state, Response, BranchService, MockService, $uibModalInstance, notiffy, branch, nextOrder) {

      var vm = this;

      if (branch) {
        vm.action = 'Modificar';
        vm.branch = branch;
        vm.branch.isUpdate = true;
      } else {
        vm.action = 'Agregar';
        //Mock Data
        if (CONSTANTS.ENV === CONSTANTS.ENVS.DEV) {
          MockService.get('branch').then(function () {
            vm.branch = Response.mock;
            vm.branch.sort = nextOrder;
          }, function () {
            notiffy.error('Error.');
          });
        } else {
          vm.branch = {sort: nextOrder};
        }
      }

      vm.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };

      vm.isDirty = function () {
        return $scope.branchForm.$dirty && $scope.submitted;
      };

      vm.save = function () {
        $scope.branchForm.$setDirty(true);
        $scope.submitted = true;
        //$scope.branchForm.user.$setValidity("duplicated", true);
        if ($scope.branchForm.$valid) {
          if (undefined == vm.branch.active) {
            vm.branch.active = true;
          }
          BranchService.save(vm.branch).then(function () {
            if (Response.saved.status == 'success') {
              $uibModalInstance.close();
              notiffy.success('Sucursal guardada exitosamente.');
            } else if (Response.saved.status == 'failure') {
              if (Response.saved.message == 'duplicated') {
                $scope.branchForm.user.$setValidity("duplicated", false);
              } else {
                notiffy.error(Response.saved.message);
              }
            } else {
              notiffy.error('Error al guardar sucursal.');
            }
          });
        }
      };

    }]);

})();