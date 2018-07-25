(function () {
  'use strict';

  var module = angular.module('aurora');

  module.factory('AppointmentService', ['$log', '$http', '$q', 'APIService', 'Response',
    function ($log, $http, $q, APIService, Response) {

      var AppointmentService = {};

      AppointmentService.getEventsByCubicle = function (cubicleId) {
        var deffered = $q.defer();
        APIService.appointment.getEventsByCubicle(cubicleId)
          .success(function (response) {
            Response.appointments = response.data;
            deffered.resolve();
          })
          .error(function (err) {
            deffered.reject();
            $log.error(err);
          });
        return deffered.promise;
      };

      AppointmentService.cancel = function (aptDto) {
        var deffered = $q.defer();
        APIService.appointment.cancel(aptDto)
          .success(function (response) {
            Response.cancelled = response.data;
            deffered.resolve();
          })
          .error(function (err) {
            deffered.reject();
            $log.error(err);
          });
        return deffered.promise;
      };

      AppointmentService.adminCancel = function (eventId) {
        var deffered = $q.defer();
        APIService.appointment.adminCancel(eventId)
          .success(function (response) {
            Response.cancelled = response.data;
            deffered.resolve();
          })
          .error(function (err) {
            deffered.reject();
            $log.error(err);
          });
        return deffered.promise;
      };

      AppointmentService.save = function (eventDto) {
        var deffered = $q.defer();
        APIService.appointment.saveEvent(eventDto)
          .success(function (response) {
            Response.saved = response;
            deffered.resolve();
          })
          .error(function (err) {
            deffered.reject();
            $log.error(err);
          });
        return deffered.promise;
      };

      AppointmentService.getUserAppointments = function (userId) {
        var deffered = $q.defer();
        APIService.appointment.getUserAppointments(userId)
          .success(function (response) {
            Response.appointments = response.data;
            deffered.resolve();
          })
          .error(function (err) {
            deffered.reject();
            $log.error(err);
          });
        return deffered.promise;
      };

      AppointmentService.getDoctors = function () {
        var deffered = $q.defer();
        APIService.appointment.getDoctors()
          .success(function (response) {
            Response.doctor = response;
            deffered.resolve();
          })
          .error(function (err) {
            deffered.reject();
            $log.error(err);
          });
        return deffered.promise;
      };

      AppointmentService.getAllEvents = function () {
        var deffered = $q.defer();
        APIService.appointment.getAllEvents()
          .success(function (response) {
            Response.saved = response;
            deffered.resolve();
          })
          .error(function (err) {
            deffered.reject();
            $log.error(err);
          });
        return deffered.promise;
      };

      return AppointmentService;

    }]);
})();