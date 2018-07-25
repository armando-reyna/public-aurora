(function () {
  'use strict';

  var module = angular.module('aurora');

  module.controller('LeadRegistrationCtrl', [
    '$rootScope', '$scope', '$state', 'LeadRegistrationService', 'Response', 'notiffy',
    function ($rootScope, $scope, $state, LeadRegistrationService, Response, notiffy) {

      var vm = this;

      vm.originId;

      vm.validateOrigin = function () {
        var origin = {id: $state.params.origin};

        LeadRegistrationService.validateOrigin(origin).then(function () {
          if (Response.origin.id != -1) {
            vm.originId = Response.origin.id;
          } else {
            $state.go("500");
          }
        }, function () {
          $state.go("500");
        });
      };

      vm.validateOrigin();

      vm.isDirty = function(){
        return $scope.leadForm.$dirty && $scope.submitted;
      };

      vm.save = function () {
        $scope.leadForm.$setDirty(true);
        $scope.submitted = true;
        $scope.leadForm.email.$setValidity("duplicated", true);
        if ($scope.leadForm.$valid) {
          vm.lead.originId = vm.originId;
          $scope.main.loading = true;
          LeadRegistrationService.saveLeadLanding(vm.lead).then(function () {
            $scope.main.loading = false;
            if (Response.saved.status == 'success') {
              $state.go('leadRegistered');
            } else if (Response.saved.status == 'failure') {
              if(Response.saved.message == 'duplicated'){
                $scope.leadForm.email.$setValidity("duplicated", false);
              }else {
                notiffy.error(Response.saved.message);
              }
            } else {
              notiffy.error('Error al guardar la informaci\u00F3n. Por favor intente nuevamente.');
            }
          }, function(){
            $scope.main.loading = false;
          });
        }
      };

    }]);
})();