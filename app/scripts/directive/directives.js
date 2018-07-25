/**
 * INSPINIA - Responsive Admin Theme
 *
 */

(function() {
  'use strict';

  var module = angular.module('aurora');

  module.directive('pageTitle', ['$rootScope', '$timeout',
      function ($rootScope, $timeout){
        return {
          link: function (scope, element) {
            var listener = function (event, toState, toParams, fromState, fromParams) {
              // Default title - load on Dashboard 1
              var title = 'Sistema de Reservas';
              // Create your own title pattern
              if (toState.data && toState.data.pageTitle) title = 'Sistema de Reservas | ' + toState.data.pageTitle;
              $timeout(function () {
                element.text(title);
              });
            };
            $rootScope.$on('$stateChangeStart', listener);
          }
        };
      }
    ]);

  module.directive('sideNavigation', ['$timeout',
    function ($timeout){
      return {
        restrict: 'A',
        link: function (scope, element) {
          // Call the metsiMenu plugin and plug it to sidebar navigation
          $timeout(function () {
            element.metisMenu();
          });
        }
      };
    }
  ]);

  module.directive('iboxTools', ['$timeout',
    function ($timeout){
      return {
        restrict: 'A',
        scope: true,
        templateUrl: 'views/common/ibox_tools.html',
        controller: ['$scope', '$element', function ($scope, $element) {
          // Function for collapse ibox
          $scope.showhide = function () {
            var ibox = $element.closest('div.ibox');
            var icon = $element.find('i:first');
            var content = ibox.find('div.ibox-content');
            content.slideToggle(200);
            // Toggle icon from up to down
            icon.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
            ibox.toggleClass('').toggleClass('border-bottom');
            $timeout(function () {
              ibox.resize();
              ibox.find('[id^=map-]').resize();
            }, 50);
          },
            // Function for close ibox
            $scope.closebox = function () {
              var ibox = $element.closest('div.ibox');
              ibox.remove();
            }
        }]
      };
    }
  ]);

  module.directive('minimalizaSidebar', ['$timeout',
    function ($timeout){
      return {
        restrict: 'A',
        template: '<a class="navbar-minimalize minimalize-styl-2 btn btn-primary " href="" ng-click="minimalize()"><i class="fa fa-bars"></i></a>',
        controller: ['$scope', '$element', function ($scope, $element) {
          $scope.minimalize = function () {
            $("body").toggleClass("mini-navbar");
            if (!$('body').hasClass('mini-navbar') || $('body').hasClass('body-small')) {
              // Hide menu in order to smoothly turn on when maximize menu
              $('#side-menu').hide();
              // For smoothly turn on menu
              setTimeout(
                function () {
                  $('#side-menu').fadeIn(400);
                }, 200);
            } else if ($('body').hasClass('fixed-sidebar')) {
              $('#side-menu').hide();
              setTimeout(
                function () {
                  $('#side-menu').fadeIn(400);
                }, 100);
            } else {
              // Remove all inline style from jquery fadeIn function to reset menu state
              $('#side-menu').removeAttr('style');
            }
          }
        }]
      };
    }
  ]);

  module.directive('iboxToolsFullScreen', ['$timeout',
    function ($timeout){
      return {
        restrict: 'A',
        scope: true,
        templateUrl: 'views/common/ibox_tools_full_screen.html',
        controller: ['$scope', '$element', function ($scope, $element) {
          // Function for collapse ibox
          $scope.showhide = function () {
            var ibox = $element.closest('div.ibox');
            var icon = $element.find('i:first');
            var content = ibox.find('div.ibox-content');
            content.slideToggle(200);
            // Toggle icon from up to down
            icon.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
            ibox.toggleClass('').toggleClass('border-bottom');
            $timeout(function () {
              ibox.resize();
              ibox.find('[id^=map-]').resize();
            }, 50);
          };
          // Function for close ibox
          $scope.closebox = function () {
            var ibox = $element.closest('div.ibox');
            ibox.remove();
          };
          // Function for full screen
          $scope.fullscreen = function () {
            var ibox = $element.closest('div.ibox');
            var button = $element.find('i.fa-expand');
            $('body').toggleClass('fullscreen-ibox-mode');
            button.toggleClass('fa-expand').toggleClass('fa-compress');
            ibox.toggleClass('fullscreen');
            setTimeout(function () {
              $(window).trigger('resize');
            }, 100);
          }
        }]
      };
    }
  ]);

  module.directive('fullScroll', ['$timeout',
    function ($timeout){
      return {
        restrict: 'A',
        link: function(scope, element) {
          $timeout(function(){
            element.slimscroll({
              height: '100%',
              railOpacity: 0.9
            });

          });
        }
      };
    }
  ]);

  module.directive('slimScroll', ['$timeout',
    function ($timeout){
      return {
        restrict: 'A',
        scope: {
          boxHeight: '@',
          callback: '&'
        },
        link: function(scope, element) {
          $timeout(function(){
            element.slimscroll({
              height: scope.boxHeight,
              railOpacity: 0.9
            }).bind('slimscroll', function(e, pos){
              if(pos == 'bottom'){
                scope.callback();
              }
            });
          });
        }
      };
    }
  ]);

  module.directive('noSpecialChar', [function() {
    return {
      require: 'ngModel',
      restrict: 'A',
      link: function(scope, element, attrs, modelCtrl) {
        modelCtrl.$parsers.push(function(inputValue) {
          if (inputValue == null)
            return ''
          var cleanInputValue = inputValue.replace(/[^\w\s]/gi, '');
          if (cleanInputValue != inputValue) {
            modelCtrl.$setViewValue(cleanInputValue);
            modelCtrl.$render();
          }
          return cleanInputValue;
        });
      }
    }
  }]);

  module.directive('alphaNumeric', [function() {
    return {
      require: 'ngModel',
      restrict: 'A',
      link: function(scope, elem, attr, ngModel) {

        var validator = function(value) {
          if (/^[a-zA-Z0-9]*$/.test(value)) {
            ngModel.$setValidity('alphanumeric', true);
            return value;
          } else {
            ngModel.$setValidity('alphanumeric', false);
            return undefined;
          }
        };
        ngModel.$parsers.unshift(validator);
        ngModel.$formatters.unshift(validator);
      }
    };
  }]);

  module.directive('validateInput', ['$timeout',
    function ($timeout){
      return {
        restrict: 'A',
        scope: {
          form: '&'
        },
        link: function(scope, elem, attr, ngModel) {
          console.log(scope);
        }
      };
    }
  ]);
  
  module.directive('onlydigits', function () {
      return {
      	
      	require: 'ngModel',
          restrict: 'A',
          link: function (scope, element, attrs, modelCtrl) {
              modelCtrl.$parsers.push(function (inputValue) {
                  if (inputValue == undefined) return '';
                  var transformedInput = inputValue.replace(/[^0-9]/g, '');
                  if (transformedInput !== inputValue) {
                      modelCtrl.$setViewValue(transformedInput);
                      modelCtrl.$render();
                  }
                  return transformedInput;
              });
          }
      };
  });

  module.directive('touchSpin', function () {
    return {
      restrict: 'A',
      scope: {
        spinOptions: '='
      },
      link: function (scope, element, attrs) {
        scope.$watch(scope.spinOptions, function(){
          render();
        });
        var render = function () {
          $(element).TouchSpin(scope.spinOptions);
        };
      }
    };
  });

  module.directive('restrictInput', function () {
    return {
      require: 'ngModel',
      restrict: 'A',
      link: function (scope, element, attrs, modelCtrl) {
        if(scope.restrict){
          modelCtrl.$parsers.push(function (inputValue) {
            if (inputValue == undefined) return '';
            var transformedInput;
            if(scope.restrict == 'numeric'){
              transformedInput = inputValue.replace(/[^0-9]/g, '');
            } else if(scope.restrict == 'double'){
              transformedInput = inputValue.replace(/[^0-9\.]+/g, '');
            } else if(scope.restrict == 'alphanumeric'){
              transformedInput = inputValue.replace(/\W+/g, '');
            }
            if (transformedInput !== inputValue) {
              modelCtrl.$setViewValue(transformedInput);
              modelCtrl.$render();
            }
            return transformedInput;
          });
        }
      }
    };
  });

  module.directive('errSrc', function() {
    return {
      link: function(scope, element, attrs) {
        element.bind('error', function() {
          if (attrs.src != attrs.errSrc) {
            attrs.$set('src', attrs.errSrc);
          }
        });
      }
    }
  });

})();
