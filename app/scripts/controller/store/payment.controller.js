(function () {
  'use strict';

  var module = angular.module('aurora');

  module.controller('StorePaymentCtrl', [
    '$rootScope', '$scope', '$state', '$sessionStorage', '$timeout', 'Response', '$uibModal', 'confirmm', 'notiffy',
    '$compile', 'StoreService', 'CONSTANTS', 'PaymentService', '$location', 'MembershipService', 'UserService','UtilService',
    function ($rootScope, $scope, $state, $sessionStorage, $timeout, Response, $uibModal, confirmm, notiffy,
              $compile, StoreService, CONSTANTS, PaymentService, $location, MembershipService, UserService, UtilService) {

      var vm = this;
      vm.userId = $sessionStorage.userToken.id;
      UserService.refreshUser(vm.userId).then(function () {
      }, function () {
        notiffy.error('Para ver la informaci\u00F3n actualizada de su membres\u00EDa por favor refresque la p\u00E1gina.');
      });

      vm.buyedMembership = $sessionStorage.buyedMembership;
      vm.paymentId = $location.search()['paymentId'];
      vm.payerID = $location.search()['PayerID'];

      vm.confirmPayment = function () {
        $scope.main.loading = true;
        PaymentService.executePayment(vm.paymentId, vm.payerID).then(function () {
          $scope.main.loading = false;
          vm.payPalResponse = Response.payPalResponse;
          if (vm.payPalResponse.state == 'approved') {
        	  vm.userId = vm.payPalResponse.transactions[0].description;
        		  if (vm.payPalResponse.transactions
        	              && vm.payPalResponse.transactions[0]
        	              && vm.payPalResponse.transactions[0].item_list
        	              && vm.payPalResponse.transactions[0].item_list.items
        	              && vm.payPalResponse.transactions[0].item_list.items[0]
        	            ) {
        	              var skuItem = vm.payPalResponse.transactions[0].item_list.items[0];
        	              $scope.main.loading = true;
        	              MembershipService.processPayPalResponse({
        	                  userId: vm.userId,
        	                  membershipId: skuItem.sku,
        	                  hours: skuItem.quantity,
        	                  total: skuItem.price * skuItem.quantity,
                          	paymentMethod : CONSTANTS.PAYMENT_METHOD.PAYPAL
        	                }
        	              ).then(function () {
        	                $scope.main.loading = false;
        	                var membershipsResponse = Response.payPalResponse.data;
        	                if (Response.payPalResponse.status == 'failure') {
        	                  confirmm.error("Error, no se ha podido procesar su pago correctamente.");
        	                } else {
        	                  UserService.refreshUser(vm.userId).then(function () {
        	                    $rootScope.token = Response.user.data;
        	                  }, function () {
        	                    notiffy.error('Para ver la informaci\u00F3n actualizada de su membres\u00EDa por favor refresque la p\u00E1gina.');
        	                  });
														notiffy.success("Gracias, se ha procesado su pago.");
        	                  $sessionStorage.alreadyReloaded = 'false';
        	                  $state.go('index.doctors-appt', {reload: true});
        	                }
        	              }, function () {
        	                $scope.main.loading = false;
        	                confirmm.error("Error, su pago se ha procesado pero hubo un problema con su membresia, contacte a un administrador.");
        	              });
        	            } else {
        	              confirmm.error("Error, su pago se ha procesado pero hubo un problema con su membresia, contacte a un administrador.");
        	            } 
              

          } else {
            confirmm.error("Error, no se ha podido procesado su pago, por favor intente de nuevo.");
          }
        }, function () {
          notiffy.error('Error al procesar el pago.');
          $scope.main.loading = false;
        });
      };

    }
  ]);
})();