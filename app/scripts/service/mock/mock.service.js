(function () {
  'use strict';

  var module = angular.module('aurora');

  module.factory('MockService', ['$log', '$http', '$q', 'APIService', 'Response','UtilService',
    function ($log, $http, $q, APIService, Response, UtilService) {

      var MockService = {};

      MockService.get = function (name) {
        var deffered = $q.defer();
        APIService.mock.get(name)
          .success(function (menu) {
            Response.mock = menu;
            deffered.resolve();
          })
          .error(function (err) {
            deffered.reject();
            $log.error(err);
          });
        return deffered.promise;
      };

      return MockService;

    }]);
})();
