(function () {
  'use strict';

  angular
    .module('aurora')
    .service('StatusService', ['$log', '$http', '$q', 'APIService', 'Response',
      function ($log, $http, $q, APIService, Response) {
        this.getStatus = function () {
            var deffered = $q.defer();
            APIService.status.getStatusList()
              .success(function (response) {
                Response.statusList = response;
                deffered.resolve();
              })
              .error(function (err) {
                deffered.reject();
                $log.error(err);
              });
            return deffered.promise;
          };
          
          this.deleteStatus = function(selectedList) {
        	  var deffered = $q.defer();
              APIService.status.deleteStatus(selectedList)
                .success(function (response) {
                  Response.deleted = response;
                  deffered.resolve();
                })
                .error(function (err) {
                  deffered.reject();
                  $log.error(err);
                });
              return deffered.promise;
          };
          
          this.save = function(status) {
        	  var deffered = $q.defer();
              APIService.status.save(status)
                .success(function (response) {
                  Response.saved = response;
                  deffered.resolve();
                })
                .error(function (err) {
                  deffered.reject();
                  $log.error(err);
                });
              return deffered.promise;
          }

      }]);
})();