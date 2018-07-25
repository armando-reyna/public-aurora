(function () {
  'use strict';

  angular
    .module('aurora')
    .factory('confirmm', ['SweetAlert',
      function (SweetAlert) {

        var confirmm = this;

        confirmm.confirm = function(message, callback){
          SweetAlert.swal({
              title: "Confirmar",
              text: message,
              type: "warning",
              showCancelButton: true,
              //confirmButtonColor: "#DD6B55",
              cancelButtonText: "Cancelar",
              confirmButtonText: "Confirmar",
              closeOnConfirm: true,
              closeOnCancel: true
            },
            function (confirmed) {
              if(confirmed){
                callback();
              }
            });
        };

        confirmm.success = function(message){
          SweetAlert.swal("Éxito", message, "success");
        };

        confirmm.error = function(message){
          SweetAlert.swal("Error", message, "error");
        };

        return confirmm;

      }]);

})();
