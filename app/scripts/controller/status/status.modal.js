(function () {
  'use strict';

  var module = angular.module('aurora');

  module.controller('StatusModalCtrl', [
    'CONSTANTS', '$rootScope', '$scope', '$state', 'StatusService', 'Response', '$uibModalInstance', 'notiffy', 'status',
    function (CONSTANTS, $rootScope, $scope, $state, StatusService, Response, $uibModalInstance, notiffy, status) {

      var vm = this;
      if (status) {
        vm.action = 'Modificar';
        vm.status = status;
        vm.status.update = true;
      } else {
        vm.action = 'Agregar';
        vm.status = {
          update: false
        };
      }
      
      vm.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };
      
      vm.save = function () {
          $scope.statusForm.$setDirty(true);
          if ($scope.statusForm.$valid) {
            StatusService.save(vm.status).then(function () {
              if (Response.saved.status == 'success') {
                $uibModalInstance.close();
                notiffy.success('Status guardado exitosamente.');
              } else if (Response.saved.status == 'failure') {
                  notiffy.error(Response.saved.message);
                  vm.cancel();
              } else {
                notiffy.error('Error al guardar el status.');
                vm.cancel();
              }
            });
          }
        };
    }]);

})();