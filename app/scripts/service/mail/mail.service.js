(function () {
  'use strict';

  angular
    .module('aurora')
    .service('MailService', ['$log', '$http', '$q', 'APIService', 'Response', '$timeout',
      function ($log, $http, $q, APIService, Response, $timeout) {

        this.getMails = function (client) {
          var deffered = $q.defer();
          APIService.mail.getAllbyClient(client)
            .success(function (response) {
              Response.mailList = response.data;
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
