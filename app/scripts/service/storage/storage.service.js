(function () {
  'use strict';

  angular
    .module('aurora')
    .service('StorageService', ['$log', '$http', '$q', 'APIService', 'Response',
      function ($log, $http, $q, APIService, Response) {

        this.getProcessList = function () {
          var deffered = $q.defer();
          APIService.storage.getProcessList()
            .success(function (response) {
              Response.processList = response.data;
              deffered.resolve();
            })
            .error(function (err) {
              deffered.reject();
              $log.error(err);
            });
          return deffered.promise;
        };

        this.startProcess = function () {
          var deffered = $q.defer();
          APIService.storage.startProcess()
            .success(function (response) {
              deffered.resolve();
            })
            .error(function (err) {
              deffered.reject();
              $log.error(err);
            });
          return deffered.promise;
        };

        this.getTreeList = function () {
          var deffered = $q.defer();
          APIService.storage.getTreeList()
            .success(function (response) {
              Response.tree = response.data;
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
