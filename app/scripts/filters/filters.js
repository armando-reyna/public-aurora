/**
 * INSPINIA - Responsive Admin Theme
 *
 */

(function() {
  'use strict';

  var module = angular.module('aurora');

  module.filter('countUnreadNotifs', ['$rootScope', '$timeout',
      function ($rootScope, $timeout){
        return function(notifications){
          return notifications.filter(function(obj){return obj.unread}).length;
        };
      }
    ]);

  module.filter('formatHr', ['$rootScope', '$timeout',
    function ($rootScope, $timeout){
      return function(hr){
        var hrSt;
        var amPm;
        if(hr < 12){
          amPm = 'am';
        }else {
          amPm = 'pm';
        }
        if(hr > 12.5){
          hr = hr-12;
        }
        if(hr < 10){
          hrSt = '0' + hr;
        }else {
          hrSt = hr;
        }
        hrSt = hrSt + ':00 ';
        hrSt = hrSt.replace('.5:00', ':30');
        hrSt = hrSt + amPm;
        return hrSt;
      };
    }
  ]);

  module.filter('formatHr2', ['$rootScope', '$timeout',
    function ($rootScope, $timeout){
      return function(hr){
        var hrSt;
        if(hr < 10){
          hrSt = '0' + hr;
        }else {
          hrSt = hr;
        }
        hrSt = hrSt + ':00:00';
        hrSt = hrSt.replace('.5:00', ':30');
        return hrSt;
      };
    }
  ]);

})();
