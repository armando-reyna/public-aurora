(function () {
  'use strict';

  angular
    .module('aurora')
    .service('LeadsService', ['$log', '$http', '$q', 'APIService', 'Response',
      function ($log, $http, $q, APIService, Response) {

        this.save = function (lead) {
          var deffered = $q.defer();
          APIService.lead.save(lead)
            .success(function (response) {
              Response.saved = response.data;
              deffered.resolve();
            })
            .error(function (err) {
              deffered.reject();
              $log.error(err);
            });
          return deffered.promise;
        };

        this.createUser = function (leadId) {
          var deffered = $q.defer();
          APIService.lead.createUser(leadId)
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

        this.saveComment = function (comment) {
          var deffered = $q.defer();
          APIService.lead.saveComment(comment)
            .success(function (response) {
              Response.comment = response.data;
              deffered.resolve();
            })
            .error(function (err) {
              deffered.reject();
              $log.error(err);
            });
          return deffered.promise;
        };

        this.saveStatus = function (statusDTO) {
          var deffered = $q.defer();
          APIService.lead.saveStatus(statusDTO)
            .success(function (response) {
              Response.status = response.data;
              deffered.resolve();
            })
            .error(function (err) {
              deffered.reject();
              $log.error(err);
            });
          return deffered.promise;
        };

        this.deleteComment = function (commentId) {
          var deffered = $q.defer();
          APIService.lead.deleteComment(commentId)
            .success(function (response) {
              Response.saved = response.data;
              deffered.resolve();
            })
            .error(function (err) {
              deffered.reject();
              $log.error(err);
            });
          return deffered.promise;
        };

        this.getLeads = function (inactive) {
          var deffered = $q.defer();
          APIService.lead.getLeads(inactive)
            .success(function (response) {
              Response.leadList = response.data;
              deffered.resolve();
            })
            .error(function (err) {
              deffered.reject();
              $log.error(err);
            });
          return deffered.promise;
        };

        this.getActiveUserLeads = function () {
          var deffered = $q.defer();
          APIService.lead.getActiveUserLeads()
              .success(function (response) {
                Response.leadList = response.data;
                deffered.resolve();
              })
              .error(function (err) {
                deffered.reject();
                $log.error(err);
              });
          return deffered.promise;
        };

        this.getActiveNonUserLeads = function () {
          var deffered = $q.defer();
          APIService.lead.getActiveNonUserLeads()
              .success(function (response) {
                Response.leadList = response.data;
                deffered.resolve();
              })
              .error(function (err) {
                deffered.reject();
                $log.error(err);
              });
          return deffered.promise;
        };

        this.getLeadStatus = function () {
          var deffered = $q.defer();
          APIService.lead.getLeadStatus()
            .success(function (response) {
              Response.leadStatusList = response.data;
              deffered.resolve();
            })
            .error(function (err) {
              deffered.reject();
              $log.error(err);
            });
          return deffered.promise;
        };

        this.activate = function (leads) {
          var deffered = $q.defer();
          APIService.lead.activate(leads)
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

        this.deactivate = function (leads) {
          var deffered = $q.defer();
          APIService.lead.deactivate(leads)
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

        this.getExecutives = function () {
          var deffered = $q.defer();
          APIService.lead.getExecutives()
            .success(function (response) {
              Response.executiveList = response.data;
              deffered.resolve();
            })
            .error(function (err) {
              deffered.reject();
              $log.error(err);
            });
          return deffered.promise;
        };

        this.uploadFile = function (uploadDTO, fields) {
          var deffered = $q.defer();
          APIService.lead.uploadFile(uploadDTO, fields)
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

        this.uploadBill = function (uploadDTO, fields) {
          var deffered = $q.defer();
          APIService.lead.uploadBill(uploadDTO, fields)
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

        this.getLeadFiles = function (userId) {
          var deffered = $q.defer();
          APIService.lead.getLeadFiles(userId)
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

        this.getCommentsByLead = function (leadId) {
          var deffered = $q.defer();
          APIService.lead.getCommentsByLead(leadId)
            .success(function (response) {
              Response.comments = response.data;
              deffered.resolve();
            })
            .error(function (err) {
              deffered.reject();
              $log.error(err);
            });
          return deffered.promise;
        };

        this.viewFile = function (file) {
          var deffered = $q.defer();
          APIService.lead.viewFile(file)
            .success(function (response) {
              Response.file = response.data;
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
            APIService.lead.deleteFile(file)
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

        this.deleteBill = function (file) {
          var deffered = $q.defer();
          APIService.lead.deleteBill(file)
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
