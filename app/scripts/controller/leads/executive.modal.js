(function () {
    'use strict';

    var module = angular.module('aurora');

    module.controller('ExecutiveModalCtrl', [
        'CONSTANTS', '$rootScope', '$scope', '$state', 'LeadRegistrationService', 'Response', '$uibModalInstance', 'notiffy', 'lead', '$log', 'LeadsService',
        function (CONSTANTS, $rootScope, $scope, $state, LeadRegistrationService, Response, $uibModalInstance, notiffy, lead, $log, LeadsService) {

            var vm = this;
            
            vm.refresh = function() {
            	LeadsService.getExecutives().then(function() {
                	vm.executives = Response.executiveList;
                }, function() {
                    notiffy.error('Error al obtener la lista de Ejecutivos.');
                });
            };

            vm.refresh();

            if (lead) {
                vm.action = 'Modificar';
                vm.lead = lead;
                vm.lead.update = true;
            } else {
                vm.action = 'Agregar';
                vm.lead = {
                    update: false,
                };
            }           

            vm.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
            
            vm.saveExecutive = function() {
            	 $scope.leadForm.$setDirty(true);
                 if ($scope.leadForm.$valid) {
                	 //(vm.lead.executive);
                     LeadRegistrationService.saveExecutive(vm.lead).then(function() {
                    	 //alert(Response.saved);
                    	 //alert(Object.keys(Response.saved));
                    	 $log.error(JSON.stringify(Response));
                    	 if (Response.saved) {
                             $uibModalInstance.close();
                             notiffy.success('Se ha registrado exitosamente.');
                         } else {
                             notiffy.error('Error al guardar la informaci\u00F3n, intente nuevamente.');
                         }
                     });
                 }
            };

        }]);

})();