(function () {
  'use strict';

  var module = angular.module('aurora');

  module.controller('ScheduledModalCtrl', [
    'CONSTANTS', '$rootScope', '$scope', '$state', 'Response', 'UserService', 'AppointmentService', '$uibModalInstance',
    '$sessionStorage', 'notiffy', '$filter', '$window', 'event', 'cubicle',
    function (CONSTANTS, $rootScope, $scope, $state, Response, UserService, AppointmentService, $uibModalInstance,
              $sessionStorage, notiffy, $filter, $window, event, cubicle) {

      var vm = this;

      vm.userId = $sessionStorage.userToken.id;
      vm.currentUser = $sessionStorage.userToken;
      vm.event = event;
      vm.cubicle = cubicle;

      vm.addToCalendar ={
        start: vm.event.date.format('YYYY-MM-DD') + ' ' + $filter('formatHr2')(vm.event.endHour),
        end: vm.event.date.format('YYYY-MM-DD') + ' ' + $filter('formatHr2')(vm.event.startHour)
      };

      console.log(vm.event);

      vm.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };

      vm.dontShow = function () {
        $uibModalInstance.close();
      };

      vm.getAppointmentModalInfo = function () {
        UserService.getAppointmentModalInfo(vm.userId).then(function () {
          if (Response.result.status == 'success') {
            var apptInfo = Response.result.data;
            vm.membershipHrs = apptInfo.membershipHrs;
            vm.membershipName = apptInfo.membershipName;
            vm.membershipExpirationDate = apptInfo.membershipExpirationDate;
            vm.loading = false;
            loadAddToCalendar();
          } else {
            notiffy.error('Error al obtener informaci\u00F3n del usuario.');
            vm.loading = false;
          }
        }, function () {
          notiffy.error('Error al obtener informaci\u00F3n del usuario.');
          vm.loading = false;
        });
      };

      vm.getAppointmentModalInfo();

      var loadAddToCalendar = function(){
        var d = document;
        var addToCalendar = d.createElement('script');
        var g = 'getElementById';
        addToCalendar.type = 'text/javascript';
        addToCalendar.charset = 'UTF-8';
        addToCalendar.async = true;
        addToCalendar.src = ('https:' == window.location.protocol ? 'https' : 'http')+'://addtocalendar.com/atc/1.5/atc.min.js';
        var h = d[g]('inmodal');
        h.appendChild(addToCalendar);
      };

      vm.cancelApt = function(){
        vm.loading = true;
        AppointmentService.cancel(vm.event).then(function() {
          vm.loading = false;
          vm.cancelled = Response.cancelled;
          $uibModalInstance.dismiss('cancel');
          if(vm.cancelled === CONSTANTS.APT.CANCELED){
            notiffy.success('La cita se ha cancelado exitosamente.');
          } else if(vm.cancelled === CONSTANTS.APT.ALREADY_CANCELED){
            notiffy.error('La cita se ya se canceló anteriormente.');
          } else if(vm.cancelled === CONSTANTS.APT.ERROR_DATE){
            notiffy.error('La cita no se ha cancelado, la fecha para cancelar ha expirado.');
          }
        }, function () {
          vm.loading = false;
        });
      }

    }]);

})();