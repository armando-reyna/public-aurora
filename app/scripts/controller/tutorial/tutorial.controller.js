(function () {
  'use strict';

  var module = angular.module('aurora');

  module.controller('TutorialCtrl', [
    '$rootScope', '$scope', '$state', '$sessionStorage', '$timeout', 'UserService', 'Response', '$uibModal', 'confirmm', 'StoreService', 'notiffy',
    function ($rootScope, $scope, $state, $sessionStorage, $timeout, UserService, Response, $uibModal, confirmm, StoreService, notiffy) {

      var vm = this;

      vm.stateData = $state.current.data;

    }]);

})();