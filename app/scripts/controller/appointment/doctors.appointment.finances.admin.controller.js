(function () {
    'use strict';

    var module = angular.module('aurora');

    module.controller('DoctorsApptFinancesAdminCtrl', [
        '$rootScope', '$scope', '$state', '$sessionStorage', '$timeout','UserService','CubicleService', 'Response', '$uibModal', 'confirmm', 'notiffy', '$compile', 'AppointmentService','CONSTANTS',
        function ($rootScope, $scope, $state, $sessionStorage, $timeout, UserService, CubicleService, Response, $uibModal, confirmm, notiffy, $compile, AppointmentService, CONSTANTS) {
            var vm = this;

            vm.userId = $sessionStorage.userToken.id;
            vm.isAdmin = $sessionStorage.userToken.role.id === CONSTANTS.ROLES.SUPER_ADMIN || $sessionStorage.userToken.role.id === CONSTANTS.ROLES.BRANCH_ADMIN;

            vm.appointments = [];

            vm.inactiveAppts = false;
            vm.deactivateEnabled = false;
            vm.activateEnabled = false;
            vm.allselected = false;

            vm.refresh = function() {
                $scope.main.loading = true;
                var inactive = {
                    inactive: vm.inactiveAppts
                };
                AppointmentService.getAllEvents().then(function () {

                    $scope.main.loading = false;
                   // alert(Object.keys(Response.saved.data[0]));
                    if (Response.saved == undefined) {
                        notiffy.error("Error al obtener citas.");
                        return;
                    }
                    vm.appointments = Response.saved.data;

                    vm.allselected = false;
                }, function () {
                    notiffy.error('Error al obtener la lista de citas.');
                    $scope.main.loading = false;
                });
            };

            vm.refresh();

            vm.enableBts = function(){
                vm.selectedList = [];
                vm.activateEnabled = false;
                vm.deactivateEnabled = false;
                vm.allselected = true;
                angular.forEach(vm.appointments, function(appt, index) {
                    if(appt.selected){
                        vm.selectedList.push(appt);
                    }else{
                        vm.allselected = false;
                    }
                });
                if(vm.selectedList.length > 0){
                    vm.activateEnabled = true;
                    vm.deactivateEnabled = true;
                }
                angular.forEach(vm.selectedList, function(appt, index) {
                    if(appt.active){
                        vm.activateEnabled = false;
                    }else {
                        vm.deactivateEnabled = false;
                    }
                });
            };

            vm.selectAll = function(){
                var select = !vm.allselected;
                angular.forEach(vm.appointments, function(appt, index) {
                    appt.selected = select;
                });
                                                                                                                                                                                                                                                                                                                                                                                                                                                vm.enableBts();
            };

            function getAppointmentIds() {
                var selectedList = [];
                angular.forEach(vm.selectedList, function(appt, index) {
                    selectedList.push(appt.id);
                });
                return selectedList;
            }

            vm.selectedAppointment;

            vm.selectAppointment = function (appt) {
                vm.selectedAppointment = appt;
            };
            vm.finances = true;

            vm.getBills = function () {
                vm.finances = false;
                vm.loading = true;

                CubicleService.getLeadUser(vm.userId).then(function() {
                    vm.loading = false;
                    if (Response.leadUser) {
                        var leadId = Response.leadUser.id;
                        getLeadBills(leadId);
                    }else{
                        notiffy.error('Error al obtener lista de archivos.');
                    }
                }, function(){
                    vm.loading = false;
                    notiffy.error('Error al obtener lista de archivos.');
                });
            };

            vm.payments = [];
            vm.getPayments = function () {
                vm.loading = true;
                UserService.getPayments(vm.userId).then(function() {
                    vm.loading = false;
                    if (Response.payments.status == "success") {
                        vm.payments = Response.payments.data;
                    }else{
                        notiffy.error('Error al obtener el historial de pagos.');
                    }
                }, function(){
                    vm.loading = false;
                    notiffy.error('Error al obtener el historial de pagos.');
                });
            };

            function getLeadBills (leadId) {
                CubicleService.getBills(leadId).then(function() {
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

            }

            vm.financesView = false;
            vm.apptsHistoryView = true;
            vm.billsView = false;
            vm.showFinancesView = function () {
                vm.financesView = true;
                vm.apptsHistoryView = false;
                vm.billsView = false;
                vm.getPayments();
            }

            vm.showApptsHistoryView = function () {
                vm.financesView = false;
                vm.apptsHistoryView = true;
                vm.billsView = false;
                vm.refresh();
            }

            vm.showBillsView = function () {
                vm.financesView = false;
                vm.apptsHistoryView = false;
                vm.billsView = true;
            }

            vm.files = [];
            function buildFileURL(files) {
                angular.forEach(files, function (file, index) {
                    file.fileURL = 'userId=' + 2 + '&fileName=' + file.name;
                });
            }
        }
    ]);
})();