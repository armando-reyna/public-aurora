(function() {
  'use strict';

  var module = angular.module('aurora');

  module.directive('calendar', ['CONSTANTS', '$rootScope', '$state', '$sessionStorage', '$timeout', 'Response', '$uibModal', 'confirmm', 'notiffy',
    '$compile', 'AppointmentService', 'CubicleService', 'UserService', 'UtilService',
    function(CONSTANTS, $rootScope, $state, $sessionStorage, $timeout, Response, $uibModal, confirmm, notiffy, $compile,
             AppointmentService, CubicleService, UserService, UtilService) {
    return {
      scope: {
        by: "=",
        cubicle: "="
      },
      restrict: "E",
      templateUrl: 'views/calendar/calendar.html',
      link: function (scope, element, attrs, modelCtrl) {

        scope.CONSTANTS = CONSTANTS;
        scope.todayDate = moment();
        scope.user = $sessionStorage.userToken;
        scope.calendarView = CONSTANTS.CALENDAR_TYPE_BY_DAY;

        scope.loadEvents = function(callback){

          if(scope.by == CONSTANTS.CALENDAR_BY_CUBICLE){
            scope.loading = true;
            AppointmentService.getEventsByCubicle(scope.cubicle.id).then(function () {
              scope.loading = false;
              scope.events = Response.appointments;
              callback();
            }, function () {
              notiffy.error('Error al obtener la lista de eventos.');
              scope.loading = false;
            });
          }else if(scope.by == CONSTANTS.CALENDAR_BY_USER){
            scope.loading = true;
            AppointmentService.getUserAppointments(scope.user.id).then(function () {
              scope.loading = false;
              scope.events = Response.appointments;
              callback();
            }, function () {
              notiffy.error('Error al obtener la lista de eventos.');
              scope.loading = false;
            });
          }

        };

        var dateEquals = function(date1, date2){
          return moment(date1).isSame(date2, 'y')
            && moment(date1).isSame(date2, 'M')
            && moment(date1).isSame(date2, 'd');
        };

        var getDayEvents = function(date){
          var dayEvents = [];
          var removeIndex;
          angular.forEach(scope.eventsLeft, function(event, index){
            if(dateEquals(event.date, date)){
              event.date = moment(event.date);
              dayEvents.push(angular.copy(event));
              removeIndex = index;
            }
          });
          if(removeIndex){
            scope.eventsLeft.splice(removeIndex, 1);
          }
          return dayEvents;
        };

        var getDayEvent = function(date, hr){
          var hrEvent;
          var removeIndex;
          angular.forEach(scope.eventsLeft, function(event, index){
            if(dateEquals(event.date, date) && event.startHour == hr){
              event.date = moment(event.date);
              hrEvent = angular.copy(event);
              hrEvent.duration = event.endHour - event.startHour;
              hrEvent.class = 'event-'+(parseInt(hrEvent.duration*2));
              removeIndex = index;
            }
          });
          if(removeIndex){
            scope.eventsLeft.splice(removeIndex, 1);
          }
          return hrEvent;
        };

        scope.setDates = function(){

          scope.loadEvents(function(){

            scope.eventsLeft = angular.copy(scope.events);

            if(scope.calendarView == CONSTANTS.CALENDAR_TYPE_BY_DAY) {

              scope.weeks = [];
              var weekIndex = 0;
              var dayIndex = 0;
              scope.weeks[weekIndex] = {visible: true, days: []};

              var firstDayOfMonth = angular.copy(scope.currentDate);
              var lastDayOfMonth = angular.copy(scope.currentDate);
              var indexDate = angular.copy(scope.currentDate);

              firstDayOfMonth.startOf('M');
              lastDayOfMonth.endOf('M');
              indexDate.startOf('M');

              var firstDayOfWeek = firstDayOfMonth.format('d');
              var lastDayOfWeek = lastDayOfMonth.format('d');

              var firstDayOfMonthVal = firstDayOfMonth.format('D');
              var lastDayOfMonthVal = lastDayOfMonth.format('D');

              var continueFillingDays = true;
              var startSettingDates = false;
              while (continueFillingDays) {
                if (lastDayOfMonthVal == indexDate.format('D')) {
                  continueFillingDays = false;
                }
                var day = {};
                if (dayIndex == firstDayOfWeek || startSettingDates) {
                  day.date = angular.copy(indexDate);
                  if (dateEquals(day.date, scope.todayDate)) {
                    day.today = true;
                    day.enableAdd = true;
                  }
                  if (scope.todayDate.isBefore(day.date)) {
                    day.enableAdd = true;
                  }
                  day.no = day.date.format('DD');
                  day.events = getDayEvents(indexDate);
                  startSettingDates = true;
                  indexDate.add(1, 'd');
                }
                scope.weeks[weekIndex].days.push(day);
                dayIndex++;
                if (dayIndex == 7) {
                  dayIndex = 0;
                  weekIndex++;
                  scope.weeks[weekIndex] = {visible: true, days: []};
                }
                if (!continueFillingDays) {
                  for (var i = dayIndex; i < 7; i++) {
                    scope.weeks[weekIndex].days.push({});
                  }
                }
              }

            }else {

              var dayOfWeek = angular.copy(scope.currentDate);
              dayOfWeek.startOf('week');

              scope.days = [];
              for(var i=0; i<7; i++){
                scope.days.push(angular.copy(dayOfWeek));
                dayOfWeek.add(1, 'd');
              }

              scope.hours = [];
              for(var i=0; i<24; i=i+.5){
                var hour = {
                  hour: i,
                  days: []
                };
                for(var j=0; j<7; j++){
                  var date = scope.days[j];
                  var today = false;
                  if (dateEquals(date, scope.todayDate)) {
                    today = true;
                  }
                  hour.days[j] = {
                    date: date,
                    today: today,
                    event: getDayEvent(date, i)
                  }
                }
                scope.hours.push(hour);
              }

            }

          });

        };

        scope.setToday = function(){
          scope.currentDate = moment();
          scope.setDates();
        };

        scope.setToday();

        scope.next = function(){
          var addTime = scope.calendarView == CONSTANTS.CALENDAR_TYPE_BY_DAY ? 'M' : 'w';
          scope.currentDate.add(1, addTime);
          scope.setDates();
        };

        scope.prev = function(){
          var addTime = scope.calendarView == CONSTANTS.CALENDAR_TYPE_BY_DAY ? 'M' : 'w';
          scope.currentDate.subtract(1, addTime);
          scope.setDates();
        };

        scope.changeView = function(view){
          scope.calendarView = view;
          scope.setDates();
        };

        var showEventScheduled = function (event) {
          var modalInstance = $uibModal.open({
            templateUrl: 'views/appointment/scheduled.modal.html',
            controller: 'ScheduledModalCtrl',
            controllerAs: 'vm',
            resolve: {
              event: function () {
                return event;
              },
              cubicle: function () {
                return scope.cubicle;
              }
            }
          });
          modalInstance.result.then(function () {
            scope.setDates();
            scope.loading = true;
            UserService.skipMessage(scope.user.id).then(function () {
              scope.loading = false;
            }, function () {
              scope.loading = false;
            });
            scope.user.skipMessage = true;
            $sessionStorage.userToken.skipMessage = true;
          }, function () {
            scope.setDates();
          });
        };

        scope.reserve = function(date, hour){

          if(hour){
            date.hour(Math.floor(hour));
            if(hour != Math.floor(hour)){
              date.minute(30);
            }else {
              date.minute(0);
            }
          }

          var now = moment();

          if (scope.calendarView == CONSTANTS.CALENDAR_TYPE_BY_DAY) {
            date.hour(now.hour() + 1);
            date.second(0);
          }

          // console.log(now);
          // console.log(date);

          if (now.isBefore(date)) {
            var modalInstance = $uibModal.open({
              templateUrl: 'views/appointment/appointment.modal.html',
              controller: 'AppontmentModalCtrl',
              controllerAs: 'vm',
              resolve: {
                date: function () {
                  return date;
                },
                cubicle: function () {
                  return scope.cubicle;
                }
              }
            });
            modalInstance.result.then(function (event) {
              scope.setDates();
              if (scope.user.role.id != CONSTANTS.ROLES.SUPER_ADMIN && scope.user.role.id != CONSTANTS.ROLES.BRANCH_ADMIN && !scope.user.skipMessage) {
                showEventScheduled(event);
              }
            }, function () {

            });
          } else {
            confirmm.error("La fecha no es v\u00E1lida.");
          }

        };

        scope.cancel = function(event){
          if (scope.user.role.id === CONSTANTS.ROLES.SUPER_ADMIN || scope.user.role.id === CONSTANTS.ROLES.BRANCH_ADMIN || event.user.id === scope.user.id) {
            confirmm.confirm("Eliminar evento " + event.title, function () {
              scope.loading = true;
              AppointmentService.adminCancel(event.id).then(function () {
                scope.loading = false;
                if(Response.cancelled === CONSTANTS.APT.CANCELED){
                  confirmm.success('La cita se ha cancelado exitosamente.');
                  scope.loading = true;
                  UserService.refreshUser(scope.user.id).then(function () {
                    scope.loading = false;
                    $rootScope.token = Response.user.data;
                  }, function () {
                    scope.loading = false;
                    notiffy.error('Error al obtener la informaci\u00F3n del usuario.');
                  });
                  scope.setDates();
                } else {
                  notiffy.error('Error al cancelar la cita.');
                }
              }, function () {
                scope.loading = false;
                notiffy.error('Error al cancelar la cita.');
              })
            });
          }
        }

      }
    };
  }]);

  module.directive('event', ['CONSTANTS', '$state', '$timeout', '$sessionStorage',
    function(CONSTANTS, $state, $timeout, $sessionStorage) {
    return {
      scope: {
        event: "=",
        ngClick: "=",
        view: "="
      },
      restrict: "E",
      templateUrl: 'views/calendar/event.btn.html',
      link: function (scope, element, attrs, modelCtrl) {

        scope.CONSTANTS = CONSTANTS;
        scope.user = $sessionStorage.userToken;

        // console.log(scope.event);
        // console.log(scope.user);

      }
    };
  }]);

})();
