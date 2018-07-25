(function () {
  'use strict';

  angular
    .module('aurora')
    .service('BranchService', ['$log', '$http', '$q', 'APIService', 'Response',
      function ($log, $http, $q, APIService, Response) {

        this.get = function (id) {
          var deffered = $q.defer();
          APIService.branch.get(id)
            .success(function (response) {
              Response.branchList = response.data;
              deffered.resolve();
            })
            .error(function (err) {
              deffered.reject();
              $log.error(err);
            });
          return deffered.promise;
        };

        this.getAll = function (inactive) {
          var deffered = $q.defer();
          APIService.branch.getAll(inactive)
            .success(function (response) {
              Response.branchList = response.data;
              deffered.resolve();
            })
            .error(function (err) {
              deffered.reject();
              $log.error(err);
            });
          return deffered.promise;
        };

        this.save = function (branch) {
          var deffered = $q.defer();
          APIService.branch.save(branch)
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

        this.activate = function (branches) {
          var deffered = $q.defer();
          APIService.branch.activate(branches)
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

        this.deactivate = function (branches) {
          var deffered = $q.defer();
          APIService.branch.deactivate(branches)
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

        this.uploadFiles = function (uploadDTO, fields) {
          var deffered = $q.defer();
          APIService.branch.uploadFiles(uploadDTO, fields)
            .success(function (response) {
              Response.uploadResult = response;
              deffered.resolve();
            })
            .error(function (err) {
              deffered.reject();
              $log.error(err);
            });
          return deffered.promise;
        };

        this.getFiles = function (branchId) {
          var deffered = $q.defer();
          APIService.branch.getFiles(branchId)
            .success(function (response) {
              Response.files = response.data;
              deffered.resolve();
            })
            .error(function (err) {
              deffered.reject();
              $log.error(err);
            });
          return deffered.promise;
        };

        this.deleteFile = function (file) {
          var deffered = $q.defer();
          APIService.branch.deleteFile(file)
            .success(function (response) {
              Response.file = response;
              deffered.resolve();
            })
            .error(function (err) {
              deffered.reject();
              $log.error(err);
            });
          return deffered.promise;
        };

        this.setFavoriteImage = function (file) {
          var deffered = $q.defer();
          APIService.branch.setFavoriteImage(file)
            .success(function (response) {
              Response.file = response;
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
