(function () {
  'use strict';

  var module = angular.module('aurora');

  module.controller('StatusCtrl', [
    '$rootScope', '$scope', '$state', '$sessionStorage', '$timeout', 'StatusService', 'CONSTANTS', 'Response', '$uibModal', 'confirmm', 'notiffy',
    function ($rootScope, $scope, $state, $sessionStorage, $timeout, StatusService, CONSTANTS, Response, $uibModal, confirmm, notiffy) {
    	var vm = this;
    	vm.loading = false;
    	vm.loading = false;
    	vm.updateEnabled = false;
    	vm.statusList = [];
    	vm.selectedList = [];
    	
    	vm.refresh = function () {
            vm.loading = true;
            StatusService.getStatus().then(function () {
              vm.statusList = Response.statusList.data;
              vm.allselected = false;
              vm.loading = false;
            }, function () {
              notiffy.error('Error al obtener la lista de status.');
              vm.loading = false;
            });
        };
        
        vm.refresh();
        
        vm.openStatusModal = function (update) {
            var modalInstance = $uibModal.open({
                templateUrl: 'views/status/status.modal.html',
                controller: 'StatusModalCtrl',
                controllerAs: 'vm',
                resolve: {
                    status: function () {
                        if (update) {
                            return vm.selectedList[0];
                        } else {
                            return undefined;
                        }
                    }
                }
            });
            modalInstance.result.then(function (selectedItem) {
                vm.refresh();
            }, function () {
                //$log.info('Modal dismissed at: ' + new Date());
            });
        };
        
        vm.deleteStatus = function(){
            var message = '';
            angular.forEach(vm.selectedList, function(status, index) {
                message += status.status;
                if (index < vm.selectedList.length-2) {
                    message += ', ';
                }else if(index < vm.selectedList.length-1){
                    message += ' y ';
                }
            });
            if (vm.selectedList.length > 1) {
                message = 'Desea eliminar los status ' + message + '?';
            } else {
                message = 'Desea eliminar ' + message + '?';
            }
            confirmm.confirm(message, function(){
                vm.loading = true;
                StatusService.deleteStatus(vm.selectedList).then(function() {
                    vm.loading = false;
                    if (Response.deleted.status == 'failure') {
                        notiffy.error('Error al eliminar status.');
                    } else {
                        notiffy.success('Status eliminado(s).');
                    }
                    vm.refresh();
                }, function() {
                    notiffy.error('Error al eliminar status.');
                });
            });
        };
        
        vm.enableBts = function() {
            vm.selectedList = [];
            vm.activateEnabled = false;
            vm.deactivateEnabled = false;
            vm.updateEnabled = false;
            vm.allselected = true;
            angular.forEach(vm.statusList, function(status, index) {
                if (status.selected) {
                    vm.selectedList.push(status);
                } else {
                    vm.allselected = false;
                }
            });
            if (vm.selectedList.length > 0) {
                vm.activateEnabled = true;
                vm.deactivateEnabled = true;
            }
            if (vm.selectedList.length == 1) {
                vm.updateEnabled = true;
            }
        };
        
        vm.selectAll = function() {
            var select = !vm.allselected;
            angular.forEach(vm.statusList, function(status, index) {
                status.selected = select;
            });
            vm.enableBts();
        };
    
    }
  ]);
})();