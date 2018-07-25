(function () {
  'use strict';

  angular
    .module('aurora')
    .service('ClientService', ['$log', '$http', '$q', 'APIService', 'Response',
      function ($log, $http, $q, APIService, Response) {

        this.save = function (client) {
          var deffered = $q.defer();
          APIService.client.save(client)
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

        this.activate = function (clients) {
          var deffered = $q.defer();
          APIService.client.activate(clients)
            .success(function (response) {
              Response.activated = response.data;
              deffered.resolve();
            })
            .error(function (err) {
              deffered.reject();
              $log.error(err);
            });
          return deffered.promise;
        };

        this.deactivate = function (clients) {
          var deffered = $q.defer();
          APIService.client.deactivate(clients)
            .success(function (response) {
              Response.deactivated = response.data;
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
