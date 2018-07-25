(function () {
    'use strict';

    var module = angular.module('aurora');

    module.controller('LeadsBillsCtrl', [
        '$sce','$rootScope', '$scope', '$state', '$sessionStorage', '$timeout','UserService', 'LeadsService','CubicleService', 'Response', '$uibModal', 'confirmm', 'notiffy','CONSTANTS',
        function ($sce, $rootScope, $scope, $state, $sessionStorage, $timeout, UserService, LeadsService, CubicleService, Response, $uibModal, confirmm, notiffy, CONSTANTS) {

            var vm = this;

            vm.inactiveLeads = false;
            vm.updateEnabled = false;
            vm.deactivateEnabled = false;
            vm.activateEnabled = false;
            vm.allselected = false;

            vm.refresh = function () {
                $scope.main.loading = true;
                var dto = {
                    inactive: false,
                    onlyClients: true
                };
                UserService.getUsers(dto).then(function () {
                    vm.leadList = Response.userList;
                    vm.allselected = false;
                    $scope.main.loading = false;
                }, function () {
                    notiffy.error('Error al obtener la lista de usuarios.');
                    $scope.main.loading = false;
                });
            };

            vm.refresh();

            vm.selectLead = function (lead) {
                vm.selectedLead = lead;
            };

            vm.showFilesSection = function (lead) {
                vm.selectLead(lead);
                vm.getBills();
            };

            vm.deleteBill = function(file) {
                var file = {
                    leadId: vm.selectedLead.id,
                    fileName: file.name
                };
                confirmm.confirm("Desea eliminar el archivo: " + file.fileName, function () {
                    vm.loading = true;
                    LeadsService.deleteBill(file).then(function () {
                        if (Response.file.status == 'success') {
                            notiffy.success(Response.file.message);
                            vm.showFilesSection(vm.selectedLead);
                            vm.loading = false;
                        } else {
                            notiffy.error('Error al borrar archivo.');
                            vm.loading = false;
                        }
                    }, function () {
                        notiffy.error('Error al borrar archivo.');
                        vm.loading = false;
                    });
                });
            };

            vm.clearSelectedLead = function () {
                delete vm.selectedLead;
            };

            vm.enableBts = function () {
                vm.selectedList = [];
                vm.activateEnabled = false;
                vm.deactivateEnabled = false;
                vm.updateEnabled = false;
                vm.allselected = true;
                angular.forEach(vm.leadList, function (lead, index) {
                    if (lead.selected) {
                        vm.selectedList.push(lead);
                    } else {
                        vm.allselected = false;
                    }
                });
                if (vm.selectedList.length > 0) {
                    vm.activateEnabled = true;
                    vm.deactivateEnabled = true;
                }
                angular.forEach(vm.selectedList, function (lead, index) {
                    if (lead.active) {
                        vm.activateEnabled = false;
                    } else {
                        vm.deactivateEnabled = false;
                    }
                });
                if (vm.selectedList.length == 1) {
                    vm.updateEnabled = true;
                }

                vm.selectedLead = getSelectedLead();
                vm.isStatusEditMode = false;
                if (vm.lead != undefined) {
                    vm.lead.status = '';
                    $scope.statusForm.$setPristine();
                }
            };

            vm.selectAll = function () {
                var select = !vm.allselected;
                angular.forEach(vm.leadList, function (lead, index) {
                    lead.selected = select;
                });
                vm.enableBts();
            };


            function getSelectedLeadIds() {
                var leadsList = [];
                angular.forEach(vm.selectedList, function (lead, index) {
                    leadsList.push(lead.id);
                });
                return leadsList;
            }

            function getSelectedLead() {
                var leadsList = [];
                angular.forEach(vm.selectedList, function (lead, index) {
                    if (lead.selected) {
                        leadsList.push(lead);
                    }
                });
                return leadsList.length == 1 ? leadsList[0] : false;
            }

            vm.isStatusEditMode = false;
            vm.changeStatusEditMode = function () {
                vm.isStatusEditMode = true;
            };

            vm.files = [];

            vm.uploadBill = function (file) {
                vm.file = file;
                if (vm.file) {
                    vm.loading = true;
                    LeadsService.uploadBill({
                        file: vm.file}, {
                        userId: vm.selectedLead.id
                    }).then(function() {
                        vm.loading = false;
                        if (Response.uploadResult.status == 'success') {
                            var files = [];
                            files = Response.uploadResult.data;
                            buildFileURL(files);
                            notiffy.success(Response.uploadResult.message);
                            vm.getBills();
                        } else{
                            notiffy.error(Response.uploadResult.message);
                        }
                    }, function(){
                        vm.loading = false;
                        notiffy.error('Error al subir el archivo.');
                    });
                }
            }

            vm.getBills = function () {
                vm.loading = true;
                CubicleService.getBills(vm.selectedLead.id).then(function() {
                    vm.loading = false;
                    if (Response.bills) {
                        vm.files = Response.bills;
                        buildFileURL(vm.files);
                    }else{
                        notiffy.error('Error al obtener lista de archivos.');
                    }
                }, function(){
                    vm.loading = false;
                    notiffy.error('Error al obtener lista de archivos.');
                });

            };

            function buildFileURL(files) {
                angular.forEach(files, function (file, index) {
                    file.fileURL = 'userId=' + vm.selectedLead.id + '&fileName=' + file.name;
                });
            }
        }]);
})();