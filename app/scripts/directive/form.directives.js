(function() {
  'use strict';

  var module = angular.module('aurora');

  module.directive('inputValidator', ['$state', '$timeout', function($state, $timeout) {
    return {
      scope: {
        inputName: "@",
        label: "@",
        type: "@",
        model: "=",
        form: "=",
        required: "=",
        minLength: "=",
        maxLength: "=",
        placeholder: "@",
        restrict: "@"
      },
      restrict: "EA",
      templateUrl: 'views/directive/input.validator.html',
      link: function (scope, element, attrs, modelCtrl) {

        scope.type = scope.type ? scope.type : 'text';
        scope.formModel = scope.form[scope.inputName];

      }
    };
  }]);

  module.directive('selectValidator', ['$state', '$timeout', function($state, $timeout) {
    return {
      scope: {
        inputName: "@",
        list: "=",
        label: "@",
        optionLabel: "@",
        model: "=",
        form: "=",
        required: "="
      },
      restrict: "EA",
      templateUrl: 'views/directive/select.validator.html',
      link: function (scope, element, attrs, modelCtrl) {

        scope.formModel = scope.form[scope.inputName];

      }
    };
  }]);

  module.directive('textareaValidator', ['$state', '$timeout', function($state, $timeout) {
    return {
      scope: {
        inputName: "@",
        label: "@",
        type: "@",
        model: "=",
        form: "=",
        required: "=",
        minLength: "=",
        maxLength: "=",
        rows: "=",
        placeholder: "@"
      },
      restrict: "EA",
      templateUrl: 'views/directive/textarea.validator.html',
      link: function (scope, element, attrs, modelCtrl) {

        scope.formModel = scope.form[scope.inputName];

      }
    };
  }]);

  module.directive('dateValidator', ['$state', '$timeout', function($state, $timeout) {
    return {
      scope: {
        inputName: "@",
        label: "@",
        model: "=",
        form: "=",
        required: "="
      },
      restrict: "EA",
      templateUrl: 'views/directive/date.validator.html',
      link: function (scope, element, attrs, modelCtrl) {

        scope.formModel = scope.form[scope.inputName];

        if(!scope.model){
          scope.model = moment();
        }

      }
    };
  }]);

  module.directive('yearValidator', ['$state', '$timeout', function($state, $timeout) {
    return {
        scope: {
            inputName: "@",
            label: "@",
            model: "=",
            form: "=",
            required: "="
        },
        restrict: "EA",
        templateUrl: 'views/directive/year.validator.html',
        link: function (scope, element, attrs, modelCtrl) {

            scope.formModel = scope.form[scope.inputName];

            if(!scope.model){
                scope.model = moment();
            }

        }
    };
  }]);

  module.directive('autocompleteSimple', ['$state', '$timeout', function($state, $timeout) {
    return {
      scope: {
        inputName: "@",
        label: "@",
        model: "=",
        autocomplete: "@",
        list: "=",
        searchStr: "=?",
        required: "=",
        placeholder: "@"
      },
      restrict: "EA",
      templateUrl: 'views/directive/autocomplete.html',
      link: function (scope, element, attrs, modelCtrl) {

        scope.$watch('selectedAutocomplete', function (newValue, oldValue) {
          if(newValue){
            scope.model = angular.copy(newValue.originalObject);
          }
        });

        scope.unselect = function() {
          delete scope.model;
        };

      }
    };
  }]);


  module.directive('autocompleteValidator', ['$state', '$timeout', function($state, $timeout) {
    return {
      scope: {
        inputName: "@",
        label: "@",
        model: "=",
        autocomplete: "@",
        list: "=",
        searchStr: "=?",
        form: "=",
        required: "=",
        placeholder: "@"
      },
      restrict: "EA",
      templateUrl: 'views/directive/autocomplete.validator.html',
      link: function (scope, element, attrs, modelCtrl) {

        scope.formModel = scope.form[scope.inputName];

        scope.$watch('selectedAutocomplete', function (newValue, oldValue) {
          if(newValue){
            scope.model = angular.copy(newValue.originalObject);
          }
        });

        scope.unselect = function() {
          delete scope.model;
        };

      }
    };
  }]);

  module.directive('autocompleteListValidator', ['$state', '$timeout', function($state, $timeout) {
    return {
      scope: {
        inputName: "@",
        label: "@",
        model: "=",
        autocomplete: "@",
        list: "=",
        form: "=",
        required: "=",
        placeholder: "@"
      },
      restrict: "EA",
      templateUrl: 'views/directive/autocomplete.validator.html',
      link: function (scope, element, attrs, modelCtrl) {

        scope.formModel = scope.form[scope.inputName];

        scope.$watch('selectedAutocomplete', function (newValue, oldValue) {
          if(newValue){
            if(!scope.model){
              scope.model = [];
            }
            scope.model.push(angular.copy(newValue.originalObject));
          }
        });

        scope.unselect = function(index) {
          scope.model.splice(index, 1);
        };


      }
    };
  }]);

})();
