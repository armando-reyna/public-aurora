(function () {
  'use strict';

  var module = angular.module('aurora');

  module.controller('LeadsClientsCtrl', [
    '$sce', '$rootScope', '$scope', '$state', '$sessionStorage', '$timeout', 'LeadsService', 'Response', '$uibModal', 'confirmm', 'notiffy', 'CONSTANTS',
    function ($sce, $rootScope, $scope, $state, $sessionStorage, $timeout, LeadsService, Response, $uibModal, confirmm, notiffy, CONSTANTS) {

      var vm = this;

      vm.inactiveLeads = false;
      vm.updateEnabled = false;
      vm.deactivateEnabled = false;
      vm.activateEnabled = false;
      vm.allselected = false;

      vm.refresh = function () {
        $scope.main.loading = true;

        LeadsService.getActiveNonUserLeads().then(function () {
          vm.leadList = Response.leadList;
          vm.allselected = false;
          $scope.main.loading = false;
        }, function () {
          notiffy.error('Error al obtener la lista de leads.');
          $scope.main.loading = false;
        });
      };

      vm.refresh();

      vm.selectLead = function (lead) {
        vm.selectedLead = lead;
      };

      vm.showFilesSection = function (lead) {
        vm.selectLead(lead);
        vm.getLeadFiles();
      };

      vm.clearSelectedLead = function () {
        delete vm.selectedLead;
      };

      vm.convertIntoClient = function (lead) {
        var leadId = lead.id;
        // confirmm.confirm("Desea crear el usuario y enviar las credenciales a "+lead.email+"?",
        confirmm.confirm("Desea crear el usuario " + lead.email + "?",
          function () {
            vm.loading = true;
            LeadsService.createUser(leadId).then(function () {
              vm.loading = false;
              if (Response.result.status === "success") {
                notiffy.success('Usuario creado exitosamente.');
                vm.refresh();
              } else {
                notiffy.error(Response.result.message);
              }

            }, function () {
              notiffy.error(Response.result.message);
            });
          });
      };

      function getSelectedLeadIds() {
        var leadsList = [];
        angular.forEach(vm.selectedList, function (lead, index) {
          leadsList.push(lead.id);
        });
        return leadsList;
      }

      function getSelectedLead() {
        var leadsList = [];
        angular.forEach(vm.selectedList, function (lead, index) {
          if (lead.selected) {
            leadsList.push(lead);
          }
        });
        return leadsList.length == 1 ? leadsList[0] : false;
      }
    }]);
})();