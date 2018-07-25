(function () {
  'use strict';

  angular
    .module('aurora')
    .service('LeadRegistrationService', ['$log', '$http', '$q', 'APIService', 'Response',
      function ($log, $http, $q, APIService, Response) {

        this.validateOrigin = function (origin) {
          var deffered = $q.defer();
          APIService.lead.validateOrigin(origin)
            .success(function (response) {
              Response.origin = response.data;
              deffered.resolve();
            })
            .error(function (err) {
              deffered.reject();
              $log.error(err);
            });
          return deffered.promise;
        };

        this.save = function (leadDTO) {
          var deffered = $q.defer();
          APIService.lead.save(leadDTO)
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

        this.saveExecutive = function (leadDTO) {
          var deffered = $q.defer();
          APIService.lead.saveExecutive(leadDTO)
            .success(function (response) {
              Response.saved = response.data;
              deffered.resolve();
            })
            .error(function (err) {
              deffered.reject();
              $log.error(err);
            });
          return deffered.promise;
        };

        this.saveLeadLanding = function (lead) {
          var deffered = $q.defer();
          APIService.lead.saveLeadLanding(lead)
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

        this.getOrigins = function () {
          var deffered = $q.defer();
          APIService.lead.getOrigins()
              .success(function (response) {
                Response.result = response;
                deffered.resolve();
              })
              .error(function (err) {
                deffered.reject();
                $log.error(err);
              });
          return deffered.promise;
        };

      }]);
})();
