(function () {
  'use strict';

  var module = angular.module('aurora');

  module.controller('AppointmentsReportCtrl', [
    '$rootScope', '$scope', '$state', '$sessionStorage', '$timeout', 'BranchService', 'CubicleService', 'Response', '$uibModal', 'confirmm', 'notiffy', 'CONSTANTS', '$window',
    function ($rootScope, $scope, $state, $sessionStorage, $timeout, BranchService, CubicleService, Response, $uibModal, confirmm, notiffy, CONSTANTS, $window) {

      var vm = this;

      vm.user = $sessionStorage.userToken;

      vm.stateData = $state.current.data;

      if(vm.user.role.id === CONSTANTS.ROLES.BRANCH_ADMIN){
        vm.selectedBranch = vm.user.branch;
      }

      vm.getBranches = function(){
        if(vm.user.role.id === CONSTANTS.ROLES.BRANCH_ADMIN){
          vm.branchList = [];
          vm.branchList.push(vm.user.branch);
        } else {
          $scope.main.loading = true;
          var inactive = {
            inactive: false
          };
          BranchService.getAll(inactive).then(function () {
            vm.branchList = Response.branchList;
            $scope.main.loading = false;
          }, function () {
            notiffy.error('Error al obtener la lista de sucursales.');
            $scope.main.loading = false;
          });
        }
      };
      vm.getBranches();

      vm.getCubicles = function () {
        $scope.main.loading = true;
        var inactive = {
          inactive: false,
          branch: vm.selectedBranch
        };
        CubicleService.getCubicles(inactive).then(function () {
          vm.cubicleList = Response.cubicleList;
          $scope.main.loading = false;
        }, function () {
          notiffy.error('Error al obtener la lista de cubículos.');
          $scope.main.loading = false;
        });
      };
      vm.getCubicles();

      vm.generateReport = function (format) {
        if (!vm.fechaInicio) {
          notiffy.error("Seleccione fecha de inicio.");
        } else if (!vm.fechaFin) {
          notiffy.error("Seleccione fecha final.");
        } else {
          var selectedCubicleId = vm.selectedCubicle ? vm.selectedCubicle.id : -1; // -1 It will generate a full report.
          var selectedBranchId = vm.selectedBranch ? vm.selectedBranch.id : -1; // -1 It will generate a full report.
          var url = CONSTANTS.API_URI + "reporte?format=" + format.VALUE + "&option=" + vm.stateData.type
            + "&from=" + vm.fechaInicio.valueOf() + "&to=" + vm.fechaFin.valueOf() + "&branchId=" + selectedBranchId + "&cubicleId=" + selectedCubicleId;
          $window.open(url, '_blank');
        }
      };
    
    }]);
})();