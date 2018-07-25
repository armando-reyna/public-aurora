(function () {
  'use strict';

  angular
    .module('aurora')
    .service('CubicleService', ['$log', '$http', '$q', 'APIService', 'Response',
      function ($log, $http, $q, APIService, Response) {

        this.save = function (cubicle) {
          var deffered = $q.defer();
          APIService.doctor.save(cubicle)
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

        this.getCubicles = function (inactive) {
          var deffered = $q.defer();
          APIService.doctor.getCubicles(inactive)
            .success(function (response) {
              Response.cubicleList = response.data;
              deffered.resolve();
            })
            .error(function (err) {
              deffered.reject();
              $log.error(err);
            });
          return deffered.promise;
        };

        this.cubiclesActivate = function (cubicles) {
          var deffered = $q.defer();
          APIService.doctor.cubiclesActivate(cubicles)
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

        this.cubiclesDeactivate = function (cubicles) {
          var deffered = $q.defer();
          APIService.doctor.cubiclesDeactivate(cubicles)
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

        this.uploadCubicleFile = function (uploadDTO, fields) {
          var deffered = $q.defer();
          APIService.doctor.uploadCubicleFile(uploadDTO, fields)
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

        this.getCubicleFiles = function (cubicleId) {
          var deffered = $q.defer();
          APIService.doctor.getCubicleFiles(cubicleId)
            .success(function (response) {
              Response.result = response.data;
              deffered.resolve();
            })
            .error(function (err) {
              deffered.reject();
              $log.error(err);
            });
          return deffered.promise;
        };

        this.getBills = function (leadId) {
          var deffered = $q.defer();
          APIService.doctor.getBills(leadId)
            .success(function (response) {
              Response.bills = response.data;
              deffered.resolve();
            })
            .error(function (err) {
              deffered.reject();
              $log.error(err);
            });
          return deffered.promise;
        };

        this.getLeadUser = function (userId) {
          var deffered = $q.defer();
          APIService.doctor.getLeadUser(userId)
            .success(function (response) {
              Response.leadUser = response.data;
              deffered.resolve();
            })
            .error(function (err) {
              deffered.reject();
              $log.error(err);
            });
          return deffered.promise;
        };

        this.deleteCubicleFile = function (file) {
          var deffered = $q.defer();
          APIService.doctor.deleteCubicleFile(file)
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
          APIService.doctor.setFavoriteImage(file)
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

        this.getCubicleTypes = function (inactive) {
          var deffered = $q.defer();
          APIService.cubicle.getCubicleTypes(inactive)
            .success(function (response) {
              Response.cubicleTypes = response.data;
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
