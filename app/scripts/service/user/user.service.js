(function () {
  'use strict';

  var module = angular.module('aurora');

  module.factory('UserService', ['$log', '$http', '$q', 'APIService', 'Response','UtilService',
    function ($log, $http, $q, APIService, Response, UtilService) {

      var UserService = {};

      UserService.login = function (user) {
        var deffered = $q.defer();
        APIService.user.login(user)
          .success(function (response) {
            Response.user = response;
            deffered.resolve();
          })
          .error(function (err) {
            deffered.reject();
            $log.error(err);
          });
        return deffered.promise;
      };

      UserService.getMenu = function (name) {
        var deffered = $q.defer();
        APIService.user.getMenu(name)
          .success(function (menu) {
            Response.menu = menu;
            deffered.resolve();
          })
          .error(function (err) {
            deffered.reject();
            $log.error(err);
          });
        return deffered.promise;
      };

      UserService.save = function (user) {
        var deffered = $q.defer();
        APIService.user.save(user)
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

      UserService.getAllUserRoles = function () {
        var deffered = $q.defer();
        APIService.user.getAllUserRoles()
          .success(function (response) {
            Response.roles = response.data;
            deffered.resolve();
          })
          .error(function (err) {
            deffered.reject();
            $log.error(err);
          });
        return deffered.promise;
      };

      UserService.getUsers = function (postObj) {
        var deffered = $q.defer();
        APIService.user.getUsers(postObj)
          .success(function (response) {
            Response.userList = response.data;
            deffered.resolve();
          })
          .error(function (err) {
            deffered.reject();
            $log.error(err);
          });
        return deffered.promise;
      };

      UserService.activate = function (users) {
        var deffered = $q.defer();
        APIService.user.activate(users)
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

      UserService.deactivate = function (users) {
        var deffered = $q.defer();
        APIService.user.deactivate(users)
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

      UserService.getPayments = function (userId) {
        var deffered = $q.defer();
        APIService.user.getPayments(userId)
          .success(function (response) {
            Response.payments = response;
            deffered.resolve();
          })
          .error(function (err) {
            deffered.reject();
            $log.error(err);
          });
        return deffered.promise;
      };

      UserService.saveMembership = function (membershipDTO) {
        var deffered = $q.defer();
        APIService.user.saveMembership(membershipDTO)
          .success(function (response) {
            Response.membership = response;
            deffered.resolve();
          })
          .error(function (err) {
            deffered.reject();
            $log.error(err);
          });
        return deffered.promise;
      };

      UserService.getAppointmentModalInfo = function (userId) {
        var deffered = $q.defer();
        APIService.user.getAppointmentModalInfo(userId)
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

      UserService.skipMessage = function (userId) {
        var deffered = $q.defer();
        APIService.user.skipMessage(userId)
          .success(function (response) {
            deffered.resolve();
          })
          .error(function (err) {
            deffered.reject();
            $log.error(err);
          });
        return deffered.promise;
      };

      UserService.changePassword = function (user) {
        var deffered = $q.defer();
        APIService.user.changePassword(user)
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

      UserService.requestresetpassword = function (user) {
        var deffered = $q.defer();
        APIService.user.requestresetpassword(user)
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

      UserService.resetPassword = function (user) {
        var deffered = $q.defer();
        APIService.user.resetPassword(user)
          .success(function (response) {
            Response.reset = response;
            deffered.resolve();
          })
          .error(function (err) {
            deffered.reject();
            $log.error(err);
          });
        return deffered.promise;
      };

      UserService.refreshUser = function (userId) {
        var deffered = $q.defer();
        APIService.user.refreshUser(userId)
          .success(function (response) {
            Response.user = response;
            UtilService.updateHeaderInfo(Response.user.data);
            deffered.resolve();
          })
          .error(function (err) {
            deffered.reject();
            $log.error(err);
          });
        return deffered.promise;
      };
      
      UserService.getCurrentMembership = function (userId) {
        var deffered = $q.defer();
        APIService.user.getCurrentMembership(userId)
          .success(function (response) {
            Response.currentMembership = response;
            deffered.resolve();
          })
          .error(function (err) {
            deffered.reject();
            $log.error(err);
          });
        return deffered.promise;
      };

      return UserService;

    }]);
})();
