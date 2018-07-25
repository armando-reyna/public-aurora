(function () {
  'use strict';

  var module = angular.module('aurora');

  module.controller('ReportesCtrl', [
    '$rootScope', '$scope', '$state', '$sessionStorage', '$timeout', 'BranchService', 'UserService', 'Response', '$uibModal', 'confirmm', 'notiffy', 'CONSTANTS', '$window',
    function ($rootScope, $scope, $state, $sessionStorage, $timeout, BranchService, UserService, Response, $uibModal, confirmm, notiffy, CONSTANTS, $window) {

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

      vm.getUsers = function () {
        var postObj = {
          inactive: false,
          onlyClients: true
        };
        if(vm.user.role.id === CONSTANTS.ROLES.BRANCH_ADMIN){
          postObj.branchId = vm.user.branch.id;
        }
        $scope.main.loading = true;
        UserService.getUsers(postObj).then(function () {
          vm.userList = Response.userList;
          $scope.main.loading = false;
        }, function () {
          notiffy.error('Error al obtener la lista de usuarios.');
          $scope.main.loading = false;
        });
      };
      vm.getUsers();

      vm.generateReport = function (format) {
        var selectedBranchId = vm.selectedBranch ? vm.selectedBranch.id : -1; // -1 It will generate a full report.
        var url = CONSTANTS.API_URI + "reporte?format=" + format.VALUE + "&option=" + vm.stateData.type + "&branchId=" + selectedBranchId;
        $window.open(url, '_blank');
      };

      vm.generateCollectionReport = function (format) {
        if (!vm.fechaInicio) {
          notiffy.error("Seleccione fecha de inicio.");
        } else if (!vm.fechaFin) {
          notiffy.error("Seleccione fecha final.");
        } else {
          var selectedUserId = vm.selectedUser ? vm.selectedUser.id : -1; // -1 It will generate a full report.
          var selectedBranchId = vm.selectedBranch ? vm.selectedBranch.id : -1; // -1 It will generate a full report.
          var url = CONSTANTS.API_URI + "reporte?format=" + format.VALUE + "&option=" + vm.stateData.type
            + "&from=" + vm.fechaInicio.valueOf() + "&to=" + vm.fechaFin.valueOf() + "&userId=" + selectedUserId
            + "&branchId=" + selectedBranchId;
          $window.open(url, '_blank');
        }
      };

    }]);
})();