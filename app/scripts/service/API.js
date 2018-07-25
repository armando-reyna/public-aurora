(function () {
  'use strict';

  var module = angular.module('aurora');

  module.factory('APIService', ['CONSTANTS', '$log', '$http', 'Upload', '$sessionStorage',
    function (CONSTANTS, $log, $http, Upload, $sessionStorage) {

      var APIService = {};

      var upload = function (uri, obj, fields) {
        return Upload.upload({
          url: CONSTANTS.API_URI + uri,
          fields: fields ? fields : {},
          file: obj ? obj.file : {}
        })
      };

      var multiUpload = function (uri, obj, fields) {
        return Upload.upload({
          url: CONSTANTS.API_URI + uri,
          fields: fields ? fields : {},
          file: obj ? obj.file : {},
          arrayKey: ''
        })
      };

      var post = function (uri, obj, headers) {
        return $http({
          url: CONSTANTS.API_URI + uri,
          method: 'POST',
          data: obj ? obj : {},
          headers: headers ? headers : {}
        });
      };

      var get = function (uri, obj, headers) {
        return $http({
          url: CONSTANTS.API_URI + uri + (obj ? obj : ''),
          method: 'GET',
          headers: headers ? headers : {}
        });
      };

      APIService.mock = {
        get: function (menu) {
          return $http({
            url: 'resources/mockdata/' + menu + '.json',
            method: 'GET'
          });
        }
      };

      APIService.user = {
        getAppointmentModalInfo: function (userId) {
          return post('rest/user/appointment-modal-info', userId);
        },
        login: function (user) {
          return post('rest/login/', user);
        },
        getMenu: function (menu) {
          return $http({
            url: 'resources/' + menu + '.json',
            method: 'GET'
          });
        },
        save: function (user) {
          return post('rest/user/', user);
        },
        getAllUserRoles: function () {
          return post('rest/roles/');
        },
        getUsers: function (postObj) {
          return post('rest/users/', postObj);
        },
        activate: function (users) {
          return post('rest/user/activate', users);
        },
        deactivate: function (users) {
          return post('rest/user/deactivate', users);
        },
        getPayments: function (userId) {
          return post('rest/user/payments', userId);
        },
        saveMembership: function (membershipDTO) {
          return post('rest/user/process-membership', membershipDTO);
        },
        skipMessage: function (userId) {
          return post('rest/user/skipmessage', userId);
        },
        changePassword: function (user) {
          return post('rest/user/changepassword', user);
        },
        requestresetpassword: function (user) {
          return post('rest/user/requestresetpassword', user);
        },
        resetPassword: function (user) {
          return post('rest/user/resetpassword', user);
        },
        refreshUser: function (userId) {
          return post('rest/user/refresh-user', userId)
        },
        getCurrentMembership: function (userId) {
          return post('rest/user/current-membership', userId)
        }
      };

      APIService.lead = {
        save: function (leadDTO) {
          return post('rest/lead/', leadDTO);
        },
        createUser: function (leadId) {
          return post('rest/lead/create-user', leadId);
        },
        saveComment: function (comment) {
          return post('rest/lead/comment', comment);
        },
        deleteComment: function (commentId) {
          return post('rest/lead/deactivate-comment', commentId);
        },
        getLeads: function (inactive) {
          return post('rest/getLeads/', inactive);
        },
        getActiveUserLeads: function () {
          return post('rest/leads/active-users');
        },
        getActiveNonUserLeads: function () {
          return post('rest/leads/non-users');
        },
        getLeadStatus: function () {
          return post('rest/lead/status');
        },
        saveStatus: function (statusDTO) {
          return post('rest/lead/save-status', statusDTO);
        },
        activate: function (leads) {
          return post('rest/lead/activate', leads);
        },
        deactivate: function (leads) {
          return post('rest/lead/deactivate', leads);
        },
        validateOrigin: function (origin) {
          return post('rest/lead/validate/origin', origin);
        },
        getExecutives: function () {
          return post('rest/lead/getExecutives');
        },
        saveExecutive: function (leadDTO) {
          return post('rest/lead/saveExecutives', leadDTO);
        },
        uploadFile: function (uploadDTO, fields) {
          return multiUpload('rest/uploadFile/', uploadDTO, fields);
        },
        uploadBill: function (uploadDTO, fields) {
          return multiUpload('rest/user/upload-bill/', uploadDTO, fields);
        },
        getLeadFiles: function (userId) {
          return post('rest/lead/files', userId);
        },
        getCommentsByLead: function (leadId) {
          return post('rest/lead/comments', leadId);
        },
        saveLeadLanding: function (leadDTO) {
          return post('rest/landingpage/', leadDTO);
        },
        deleteFile: function (file) {
          return post('rest/lead/delete-ufile/', file);
        },
        deleteBill: function (file) {
          return post('rest/user/delete-bill/', file);
        },
        getOrigins: function () {
          return post('rest/lead/origins/');
        }
      };

      APIService.branch = {
        get: function (id) {
          return post('rest/branch', id);
        },
        getAll: function (inactive) {
          return post('rest/branch/all', inactive);
        },
        save: function (branch) {
          return post('rest/branch/save', branch);
        },
        activate: function (branches) {
          return post('rest/branch/activate', branches);
        },
        deactivate: function (branches) {
          return post('rest/branch/deactivate', branches);
        },
        uploadFiles: function (uploadDTO, fields) {
          return multiUpload('rest/branch/file/upload', uploadDTO, fields);
        },
        getFiles: function (branchId) {
          return post('rest/branch/file', branchId);
        },
        deleteFile: function (file) {
          return post('rest/branch/file/delete', file);
        },
        setFavoriteImage: function (file) {
          return post('rest/branch/file/favorite', file);
        }
      };

      APIService.cubicle = {
        getCubicleTypes: function () {
          return post('rest/cubicle/types');
        }
      };

      APIService.doctor = {
        getCubicles: function (inactive) {
          return post('rest/cubicles/', inactive);
        },
        save: function (cubicle) {
          return post('rest/client/save-cubicle', cubicle);
        },
        cubiclesActivate: function (cubicles) {
          return post('rest/client/cubicles/activate', cubicles);
        },
        cubiclesDeactivate: function (cubicles) {
          return post('rest/client/cubicles/deactivate', cubicles);
        },
        uploadCubicleFile: function (uploadDTO, fields) {
          return multiUpload('rest/cubicle/upload/', uploadDTO, fields);
        },
        getCubicleFiles: function (cubicleId) {
          return post('rest/cubicle/files', cubicleId);
        },
        getBills: function (leadId) {
          return post('rest/user/bills', leadId);
        },
        getLeadUser: function (userId) {
          return post('rest/lead/user', userId);
        },
        deleteCubicleFile: function (file) {
          return post('rest/cubicle/delete-file/', file);
        },
        setFavoriteImage: function (file) {
          return post('rest/cubicle/favorite-img', file);
        }
      };

      APIService.appointment = {
        getEventsByCubicle: function (cubicle) {
          return post('rest/appointment/cubicle-event', cubicle);
        },
        cancel: function (eventDto) {
          return post('rest/appointment/cancel', eventDto);
        },
        adminCancel: function (eventId) {
          return post('rest/appointment/admin/cancel', eventId);
        },
        saveEvent: function (eventDto) {
          return post('rest/appointment/save-event', eventDto);
        },
        getUserAppointments: function (userId) {
          return post('rest/user/appointments', userId);
        },
        getDoctors: function () {
          return post('rest/user/get-doctors');
        },
        getAllEvents: function () {
          return post('rest/appointment/all-events');
        }
      };

      APIService.membership = {
        processPayPalResponse: function (payPalRequest) {
          return post("rest/membership/paypal-payment-validation", payPalRequest);
        },
        payPaypal: function () {
          return post("rest/membership/pay-paypal");
        },
        getMainMemberships: function () {
          return post("rest/membership/membershipsByType");
        },
        deleteMembershipTypes: function (membershipId) {
          return post("rest/membership/delete-memberships", membershipId);
        },
        saveMembershipType: function (membershipDTO) {
          return post('rest/membership/save-membership', membershipDTO);
        },
        uploadMembershipTypeImage: function (file, membershipId) {
          return upload('rest/membership/upload-membership-image', file, membershipId);
        },
        sendReminder: function (userId) {
          return post('rest/membership/reminder', userId);
        }
      };

      APIService.store = {
        getShoppableMemberships: function (userId) {
          return post("rest/membership/valid-memberships", userId);
        }
      };

      APIService.status = {
        getStatusList: function () {
          return post("rest/status/available-status");
        },
        deleteStatus: function (selectedList) {
          return post("rest/status/delete-status", selectedList);
        },
        save: function (status) {
          return post("rest/status/save-status", status);
        }
      };

      APIService.payment = {
        oauth: function () {
          var authSt = CONSTANTS.PAYPAL.CLIENT_ID + ':' + CONSTANTS.PAYPAL.SECRET;
          // console.log(authSt);
          return $http({
            url: CONSTANTS.PAYPAL.URL + '/v1/oauth2/token',
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-type': 'application/x-www-form-urlencoded',
              'Accept-Language': 'en_US',
              'Authorization': 'Basic ' + btoa(authSt)
            },
            data: 'grant_type=client_credentials'
          });
        },
        createPayment: function (buy) {
          return $http({
            url: CONSTANTS.PAYPAL.URL + '/v1/payments/payment',
            method: 'POST',
            headers: {
              'Content-type': 'application/json',
              'Authorization': 'Bearer ' + $sessionStorage.paypalToken.access_token
            },
            data: buy
          });
        },
        executePayment: function (paymentId, payerId) {
          return $http({
            url: CONSTANTS.PAYPAL.URL + '/v1/payments/payment/' + paymentId + '/execute',
            method: 'POST',
            headers: {
              'Content-type': 'application/json',
              'Authorization': 'Bearer ' + $sessionStorage.paypalToken.access_token
            },
            data: {
              payer_id: payerId
            }
          });
        },
        transferPayment: function (userId) {
          return post("rest/membership/transfer-payment", userId);
        }
      };

      APIService.conekta = {
        pay: function (cc) {
          return post("rest/payment/pay", cc);
        }
      };

      return APIService;

    }]);

})();
