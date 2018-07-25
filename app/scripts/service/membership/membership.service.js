(function () {
  'use strict';

  var module = angular.module('aurora');

  module.factory('MembershipService', ['$log', '$http', '$q', 'APIService', 'Response',
    function ($log, $http, $q, APIService, Response) {

      var MembershipService = {};

      MembershipService.processPayPalResponse = function (requestDTO) {
        var deffered = $q.defer();
        APIService.membership.processPayPalResponse(requestDTO)
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

      MembershipService.payPaypal = function () {
        var deffered = $q.defer();
        APIService.membership.payPaypal()
          .success(function (response) {
            Response.payment = response;
            deffered.resolve();
          })
          .error(function (err) {
            deffered.reject();
            $log.error(err);
          });
        return deffered.promise;
      };
      
      MembershipService.getMainMemberships = function() {
        var deffered = $q.defer();
        APIService.membership.getMainMemberships()
          .success(function (response) {
          Response.membershipTypes = response;
          deffered.resolve();
        })
          .error(function (err) {
          deffered.reject();
          $log.error(err);
        });
        return deffered.promise;
      };
      
      MembershipService.deleteMembershipTypes = function(membershipId) {
    	var deffered = $q.defer();
        APIService.membership.deleteMembershipTypes(membershipId)
          .success(function (response) {
          Response.membershipResponse = response;
          deffered.resolve();
        })
          .error(function (err) {
          deffered.reject();
          $log.error(err);
        });
        return deffered.promise;
      };
      
      MembershipService.save = function(membershipDTO) {
      	var deffered = $q.defer();
        APIService.membership.saveMembershipType(membershipDTO)
          .success(function (response) {
        	  Response.membershipResponse = response;
              deffered.resolve();
        })
          .error(function (err) {
          deffered.reject();
          $log.error(err);
        });
        return deffered.promise;
      };

      MembershipService.uploadMembershipTypeImage = function(fileDTO, mId) {
        var deffered = $q.defer();
        APIService.membership.uploadMembershipTypeImage(fileDTO, mId).success(function (response) {
          Response.membershipFileResponse = response;
          deffered.resolve();
        }).error(function (err) {
          deffered.reject();
          $log.error(err);
        });
        return deffered.promise;
      };

      MembershipService.sendReminder = function(userId) {
        var deffered = $q.defer();
        APIService.membership.sendReminder(userId)
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

      return MembershipService;

    }]);
})();