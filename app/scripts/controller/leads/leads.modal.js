(function () {
  'use strict';

  var module = angular.module('aurora');

  module.controller('LeadsModalCtrl', [
    'CONSTANTS', '$rootScope', '$scope', '$state', '$sessionStorage', 'LeadRegistrationService', 'BranchService', 'Response', '$uibModalInstance', 'notiffy', 'lead', '$log',
    function (CONSTANTS, $rootScope, $scope, $state, $sessionStorage, LeadRegistrationService, BranchService, Response, $uibModalInstance, notiffy, lead, $log) {

      var vm = this;

      vm.userToken = $sessionStorage.userToken;

      if (lead.isUpdate) {
        vm.action = 'Modificar';
        buildLeadDTO();
        vm.lead.isUpdate = true;
      } else {
        vm.action = 'Agregar';
      }

      vm.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };

      vm.isDirty = function(){
        return $scope.leadForm.$dirty && $scope.submitted;
      };

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
        $scope.leadForm.$setDirty(true);
        $scope.submitted = true;
        $scope.leadForm.email.$setValidity("duplicated", true);
        if ($scope.leadForm.$valid) {
          LeadRegistrationService.save(vm.lead).then(function () {
            if (Response.saved.status == 'success') {
              $uibModalInstance.close();
              notiffy.success('Lead guardado exitosamente.');
            } else if (Response.saved.status == 'failure') {
              if(Response.saved.message == 'duplicated'){
                $scope.leadForm.email.$setValidity("duplicated", false);
              }else {
                notiffy.error(Response.saved.message);
              }
            } else {
              notiffy.error('Error al guardar Lead. Por favor intente nuevamente');
            }
          });
        }
      };

      vm.loadOrigins = function () {
        LeadRegistrationService.getOrigins().then(function () {
          if (Response.result.status == 'success') {
            vm.origins = Response.result.data;
            if (lead.isUpdate) {
              vm.setOrigin();
            }
          }
          else {
            notiffy.error('Error al cargar lista de origins.');
          }
        }, function () {
          notiffy.error('Error al cargar lista de origins.');
        });
      };

      vm.loadOrigins();

      vm.setOrigin = function () {
        angular.forEach(vm.origins, function (origin, index) {
          if (origin.id == lead.origin.id) {
            vm.lead.origin = vm.origins[index];
          }
        });
      };

      function buildLeadDTO() {
        vm.lead = {};
        vm.lead.id = lead.id;
        vm.lead.name = lead.name;
        vm.lead.email = lead.email;
        vm.lead.origin = {};
        if (lead.origin != null) {
          vm.lead.originId = lead.origin.id;
        }
        vm.lead.mobile = lead.mobile;
        vm.lead.phone = lead.phone;
        if (lead.status != null) {
          vm.lead.statusId = lead.status.id;	
        }
      }

    }]);

})();