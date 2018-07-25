(function () {
  'use strict';

  var module = angular.module('aurora');

  module.controller('StoreApptFinancesCtrl', [
    '$rootScope', '$scope', '$state', '$sessionStorage', '$timeout', 'Response', '$uibModal', 'confirmm', 'notiffy',
    '$compile', 'StoreService', 'CONSTANTS', 'PaymentService', '$window', '$location', 'UserService',
    function ($rootScope, $scope, $state, $sessionStorage, $timeout, Response, $uibModal, confirmm, notiffy,
              $compile, StoreService, CONSTANTS, PaymentService, $window, $location, UserService) {

      var vm = this;
      vm.userId = $sessionStorage.userToken.id;
      vm.loading = false;
      vm.memberships = [];

      vm.extraHrs = 0;

      vm.initPage = function () {
        getShoppableMemberships();
      };

      vm.initPage();

      function getShoppableMemberships() {
        vm.loading = true;
        vm.costPerHr = 0;
        StoreService.getShoppableMemberships(vm.userId).then(function () {
          vm.loading = false;
          if (Response.shoppableMemberships.status == "success") {
        	vm.payPalResponse = Response.shoppableMemberships;  
            vm.memberships = Response.shoppableMemberships.data;

            // UserService.refreshUser(vm.userId).then(function () {
            //   if (Response.user.data.currentMembership) {
            //     vm.costPerHr = Response.user.data.currentMembership.type.costPerHr;
            //     console.log(vm.costPerHr);
            //   }
                for (var i = 0; i  < vm.memberships.length; i++) {
                	if (vm.memberships[i].type == 'EXTRA_HOUR') {
                		vm.memberships[i].price = vm.memberships[i].costPerHr;
                	}
                }
            // }, function () {
    	       //  console.log('Error al obtener la informaci\u00F3n del usuario.');
            // });

          } else {
            notiffy.error('Error al obtener membres\u00EDas.');
          }
        }, function () {
          vm.loading = false;
          notiffy.error('Error al obtener membres\u00EDas.');
        });
      }

      function getMembershipQuantity (membership) {
        return membership.type == "EXTRA_HOUR" ? vm.extraHrs: 1;
      }

      vm.openPaymentModal = function (membership) {
        if(membership.type != "EXTRA_HOUR" || (membership.type == "EXTRA_HOUR" && vm.extraHrs && vm.extraHrs>0)){
          var modalInstance = $uibModal.open({
            templateUrl: 'views/store/payment.modal.html',
            controller: 'PaymentModalCtrl',
            controllerAs: 'vm',
            resolve: {
              membership: function () {
                return membership;
              },
              extraHrs: function () {
                return vm.extraHrs ? vm.extraHrs : 0;
              }
            }
          });
          modalInstance.result.then(function (selectedItem) {
            // vm.refresh();
          }, function () {
            //$log.info('Modal dismissed at: ' + new Date());
          });
        }else {
          notiffy.error('Ingrese las horas extra que desea comprar, mayor a 0');
        }
      };

      vm.pay = function (membership) {
        $scope.main.loading = true;
        PaymentService.oauth().then(function () {

          $sessionStorage.paypalToken = Response.token;
          var membershipQty = getMembershipQuantity(membership);
          
          var buy = {
            "intent": "sale",
            "redirect_urls": {
              "return_url": CONSTANTS.API_URI_UI + "index/payment",
              "cancel_url": CONSTANTS.API_URI_UI + "index/doctors-store"
            },
            "payer": {
              "payment_method": "paypal"
            },
            "transactions": [
              {
                "amount": {
                  "total": membership.price * membershipQty,
                  "currency": "MXN"
                },
                "description": membership.name,
                "item_list": {
                    "items": [
                      {
                        "name": membership.name,
                        "sku": membership.id,
                        "price": membership.price,
                        "currency": "MXN",
                        "quantity": membershipQty,
                        "description": membership.name,
                        "tax": "0.00"
                      }
                  ]
                }
              }
            ]
          };
          if (membership.type == "EXTRA_HOUR") {
        	  membership.hours = membershipQty;
        	  membership.price = membership.price * membershipQty;
          }
          PaymentService.createPayment(buy).then(function () {
            vm.payPalResponse = Response.payPalResponse;
            $sessionStorage.buyedMembership = membership;
            $window.location.href = vm.payPalResponse.links[1].href;
          }, function () {
            notiffy.error('Error al obtener generar el pago.');
            $scope.main.loading = false;
          });

        }, function () {
          notiffy.error('Error al obtener el token de paypal.');
          $scope.main.loading = false;
        });
      };

      vm.addHr = function(){
        if(vm.extraHrs < 99){
          vm.extraHrs++;
        }
      };

      vm.subsHr = function(){
        if(vm.extraHrs > 0){
          vm.extraHrs--;
        }
      };

    }
  ]);
})();