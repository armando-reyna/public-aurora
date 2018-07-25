(function () {
  'use strict';

  var module = angular.module('aurora');

  module.factory('UtilService', ['CONSTANTS', '$log', '$http', 'Upload','$rootScope', 'notiffy',
    function (CONSTANTS, $log, $http, Upload, $rootScope, notiffy) {

      var UtilService = {};

      UtilService.mapEvents = function(events, eventsMapped, currentUserId){
        eventsMapped.length = 0;
        for (var i = 0; i < events.length; i++) {
          var titleMsg = events[i].title;
          var color = "#1ab394";
          if (currentUserId && events[i].user.id != currentUserId) {
            titleMsg = "Ocupado";
            color = "#FF0000";
          }
          var auxDate = new Date(events[i].date);

          var start = angular.copy(auxDate);
          start.setHours(events[i].startHour);
          if(Math.floor(events[i].startHour) !== events[i].startHour){
            start.setMinutes(30);
          }

          var end = angular.copy(auxDate);
          end.setHours(events[i].endHour);
          if(Math.floor(events[i].endHour) !== events[i].endHour){
            end.setMinutes(30);
          }

          eventsMapped.push(
            {
              id: events[i].id,
              index: i,
              title: titleMsg,
              start: start,
              end: end,
              backgroundColor: color,
              borderColor: color,
              user: events[i].user
            }
          );
        }
      };

      UtilService.updateHeaderInfo = function (session) {
        $rootScope.headerInfo = {};
        $rootScope.headerInfo.user = session.user;
        $rootScope.headerInfo.name = session.name;
        $rootScope.headerInfo.currentMembership = {type: {name: 'Sin membres\u00EDa'}};
        if (session.currentMembership) {
          $rootScope.headerInfo.currentMembership = session.currentMembership;
        }
        $rootScope.headerInfo.hasUnlimitedMembership = session.hasUnlimitedMembership;
        $rootScope.headerInfo.role = session.role;
        $rootScope.headerInfo.branch = session.branch;
        $rootScope.headerInfo.membershipHrs = session.membershipHrs;
        if (session.relatedMembership) {
          $rootScope.headerInfo.hasMultipleMemberships = session.relatedMembership.length > 1 ? true : false;
        }

        $rootScope.occupiedSize = (session.cloudSize / 1024 / 1024).toFixed(2);
        $rootScope.availableSize = CONSTANTS.CLOUD_SPACE - $rootScope.occupiedSize;

        $rootScope.occupiedPercentage = ($rootScope.occupiedSize * 100 / CONSTANTS.CLOUD_SPACE).toFixed(2);
        $rootScope.availablePercentage = ($rootScope.availableSize * 100 / CONSTANTS.CLOUD_SPACE).toFixed(2);

        if($rootScope.availablePercentage <= 1){
          notiffy.error('Ha rebasado el limite de espacio en la nube.');
        }

      };


      return UtilService;

    }]);

})();
