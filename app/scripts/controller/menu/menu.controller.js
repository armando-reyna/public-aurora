(function () {
  'use strict';

  var loginModule = angular.module('aurora');

  loginModule.controller('IndexCtrl', [
    '$rootScope', '$scope', '$state', '$sessionStorage', '$timeout', 'UserService', 'Response',
    function ($rootScope, $scope, $state, $sessionStorage, $timeout, UserService, Response) {

      $scope.customMenu = $sessionStorage.userToken.role.menu;
      $rootScope.root = $sessionStorage.userToken;

    }]);

})();