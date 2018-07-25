
(function () {
  'use strict';

  var module = angular.module('aurora');

  module.controller('HomeCtrl', [
    'CONSTANTS', '$rootScope', '$scope', '$state', '$window', '$sessionStorage', '$timeout', 'ClientService', 'Response', '$uibModal', 'confirmm', 'notiffy',
    function (CONSTANTS, $rootScope, $scope, $state, $window, $sessionStorage, $timeout, ClientService, Response, $uibModal, confirmm, notiffy) {

      var vm = this;

      if(!$scope.main.token || $scope.main.token != $sessionStorage.userToken){
        $scope.main.token = $sessionStorage.userToken;
      }

      vm.labels = ["Utilizado", "Disponible"];
      vm.data = [$rootScope.occupiedSize, $rootScope.availableSize];
      vm.options = { colors : [ '#e53235', '#3d4296' ] };

      // console.log($scope.main.token);

    }]);

})();