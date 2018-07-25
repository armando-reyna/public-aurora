(function () {
  'use strict';

  angular
    .module('aurora')
    .factory('notiffy', ['notify', '$rootScope', '$sessionStorage',
      function (notify, $rootScope, $sessionStorage) {

        var notiffy = this;

        if(!$sessionStorage.notifications){
          $sessionStorage.notifications = [];
        }

        $rootScope.notifications = $sessionStorage.notifications;

        var pushNotification = function(notification){
          notification.unread = true;
          $rootScope.notifications.push(notification);
          notification.templateUrl = 'views/common/notify.html';
          notify(notification);
        };

        notify.config({
          duration: 3000,
          startTop: 60,
          position: 'right'
        });

        notiffy.info = function(message){
          var notification = {
            message: message,
            classes: 'alert-info',
            icon: 'fa-exclamation-circle',
            foreground: 'success'
          };
          pushNotification(notification);
        };

        notiffy.success = function(message){
          var notification = {
            message: message,
            classes: 'alert-success',
            icon: 'fa-check',
            foreground: '.info'
          };
          pushNotification(notification);
        };

        notiffy.warning = function(message){
          var notification = {
            message: message,
            classes: 'alert-warning',
            icon: 'fa-exclamation-circle',
            foreground: 'warning'
          };
          pushNotification(notification);
        };

        notiffy.error = function(message){
          var notification = {
            message: message,
            classes: 'alert-danger',
            icon: 'fa-exclamation-triangle',
            foreground: 'danger'
          };
          pushNotification(notification);
        };

        return notiffy;

      }]);

})();
