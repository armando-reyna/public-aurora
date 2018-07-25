(function () {
  'use strict';

  var module = angular.module('aurora');

  module.factory('PaymentService', ['$log', '$http', '$q', 'APIService', 'Response',
    function ($log, $http, $q, APIService, Response) {

      var PaymentService = {};

      PaymentService.oauth = function () {
        var deffered = $q.defer();
        APIService.payment.oauth()
          .success(function (response) {
            Response.token = response;
            deffered.resolve();
          })
          .error(function (err) {
            deffered.reject();
            $log.error(err);
          });
        return deffered.promise;
      };

      PaymentService.createPayment = function (buy) {
        var deffered = $q.defer();
        APIService.payment.createPayment(buy)
          .success(function (response) {
            Response.payPalResponse = response;
            deffered.resolve();
          })
          .error(function (err) {
            deffered.reject();
            $log.error(err);
          });
        return deffered.promise;
      };

      PaymentService.executePayment = function (paymentId, payerId) {
        var deffered = $q.defer();
        APIService.payment.executePayment(paymentId, payerId)
          .success(function (response) {
            Response.payPalResponse = response;
            deffered.resolve();
          })
          .error(function (err) {
            deffered.reject();
            $log.error(err);
          });
        return deffered.promise;
      };

      PaymentService.transferPayment = function (userId) {
        var deffered = $q.defer();
        APIService.payment.transferPayment(userId)
          .success(function (response) {
            Response.response = response;
            deffered.resolve();
          })
          .error(function (err) {
            deffered.reject();
            $log.error(err);
          });
        return deffered.promise;
      };

      //****************** Conekta ******************

      PaymentService.conekta = function(buy) {
        var deffered = $q.defer();
        APIService.conekta.pay(buy)
          .success(function (response) {
            Response.conektaResponse = response.data;
            deffered.resolve();
          })
          .error(function (err) {
            deffered.reject();
            $log.error(err);
          });
        return deffered.promise;
      };

      return PaymentService;

    }]);
})();