(function () {
  'use strict';

  angular.module('aurora').service('StoreService', ['$log', '$http', '$q', 'APIService', 'Response',
      function ($log, $http, $q, APIService, Response) {
	    this.getShoppableMemberships = function (userId) {
          var deffered = $q.defer();
          APIService.store.getShoppableMemberships(userId)
            .success(function (response) {
              Response.shoppableMemberships = response;
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