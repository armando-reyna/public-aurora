(function () {
    'use strict';

    var module = angular.module('aurora');

    module.controller('MemberShipSuccesfullCtrl', [
        '$rootScope', '$scope', '$state', '$sessionStorage', '$timeout', 'Response', '$uibModal', 'confirmm', 'notiffy', '$compile', 'MembershipService', 'UserService',
        function ($rootScope, $scope, $state, $sessionStorage, $timeout, Response, $uibModal, confirmm, notiffy, $compile, MembershipService,  UserService) {
            var vm = this;
            vm.userId = $sessionStorage.userToken.id;
            vm.getParameterByName = function(name) {
            	var url = window.location.href;
                name = name.replace(/[\[\]]/g, "\\$&");
                var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                    results = regex.exec(url);
                if (!results) return null;
                if (!results[2]) return '';
                return decodeURIComponent(results[2].replace(/\+/g, " "));
            };
            vm.transactionID;
            vm.payPalResponse;
            vm.headerCSS;
            vm.headerIcon;
            vm.headerTitle;
            vm.hasError = false;
            vm.hasWarning = false;
            vm.verifyPayPalPayment = function () {
                vm.loading = true;
                vm.transactionID = vm.getParameterByName('tx');
                if (vm.transactionID != undefined && vm.transactionID != '') {
                    var requestDTO = {transactionId : vm.transactionID, userId : vm.userId};
                    MembershipService.getPayPalResponse(requestDTO).then(function() {
                        vm.payPalResponse = Response.payPalResponse;
                        initPage(vm.payPalResponse)
                        vm.loading = false;
                    }, function () {
                        initPage(vm.payPalResponse);
                        vm.loading = false;
                    });
                }
            }

            vm.verifyPayPalPayment();

            function initPage(payPalResponse) {
              if (payPalResponse.status == 'success') {
                  UserService.refreshUser(vm.userId).then(function () {
                      $rootScope.token = Response.user.data;
                  }, function () {
        	          console.log('Error al obtener la informaci\u00F3n del usuario.');
                  });
                vm.detailSection = 'Estimado usuario, las horas que se han agregado a su cuenta tienen una validez de 30 d\u00EDas posteriores a su compra.';
                setHeader('text-success', 'fa fa-check fa-3', 'Gracias por su compra');
                setPaymentInfoSection(payPalResponse.data);
                  vm.detailSection += '</br></br><i class="fa fa-paypal fa3 text-paypal" aria-hidden="true"></i> Transacci\u00F3n n\u00FAmero: <strong>' + vm.transactionID + '</strong>'
              } else if (payPalResponse.status == 'warning') {
                vm.hasWarning = true;
                setHeader('text-warning', 'fa fa-exclamation-triangle', payPalResponse.message);
              } else if (payPalResponse == undefined || payPalResponse.status == 'failure') {
                vm.hasError = true;
                setHeader('text-error', 'fa fa-times', 'Ha ocurrido un error');
                vm.detailSection = 'Estimado usuario, No hemos podido procesar su pago adecuadamente. Por favor contacte al administrador del sistema.'+
                        '</br></br><strong>Informaci&oacute;n adicional: </strong>'+ payPalResponse.message +
                        '</br></br><i class="fa fa-paypal fa3 text-paypal" aria-hidden="true"></i> Transacci\u00F3n n\u00FAmero: <strong>' + vm.transactionID + '</strong>';
              }
            };

            function setPaymentInfoSection(paypalData) {
                try {
                    var paymentData = JSON.parse(paypalData.payment_transaction);
                    var membership = paymentData.membershipType;
                    vm.membershipName = membership.name;
                    vm.totalCost = paymentData.formattedTotalCost;
                    //vm.unitPrice = membership.formattedCostPerHr || membership.formattedPrice;
                    vm.hours = membership.hours || paymentData.extraHrs;
                    var user = paymentData.user;
                    vm.userHrs = user.membershipHrs;
                } catch (err) {
                    vm.hasError = true;
                    setHeader('text-error', 'fa fa-times', 'Ha ocurrido un error');
                    vm.detailSection +=
                        '</br></br><i class="fa fa-exclamation-triangle text-error" aria-hidden="true"></i> Ha ocurrido un problema al guardar la informaci\u00F3n de su pago en nuestro sistema.'

                }
            }

            function setHeader(headerCSS, headerIcon, headerTitle) {
                vm.headerCSS = headerCSS;
                vm.headerIcon = headerIcon;
                vm.headerTitle = headerTitle;
            };

        }
    ]);
})();