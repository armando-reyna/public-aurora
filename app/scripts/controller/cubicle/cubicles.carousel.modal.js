(function () {
  'use strict';

  var module = angular.module('aurora');

  module.controller('CubilclesCarouselModalCtrl', [
    'CONSTANTS', '$rootScope', '$scope', '$state', 'LeadRegistrationService', 'Response', '$uibModalInstance', '$timeout', 'files', 'index',
    function (CONSTANTS, $rootScope, $scope, $state, LeadRegistrationService, Response, $uibModalInstance, $timeout, files, index) {

      var vm = this;

      vm.loading = true;
      $timeout(function(){
        vm.loading = false;
      }, 1000);

      vm.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };

      vm.active = index;

      vm.images = [];
      angular.forEach(files, function (file, index) {
        vm.images.push({
          id: index,
          url: CONSTANTS.API_URI + 'cubicle/view-file?' + file.url
        });
      });

    }]);

})();