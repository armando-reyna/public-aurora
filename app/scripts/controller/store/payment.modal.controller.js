(function () {
  'use strict';

  var module = angular.module('aurora');

  module.controller('PaymentModalCtrl', [
    '$rootScope', '$scope', '$state', '$sessionStorage', '$timeout', 'Response', '$uibModalInstance', 'confirmm', 'notiffy',
    '$compile', 'StoreService', 'CONSTANTS', 'PaymentService', '$window', 'membership', 'extraHrs', 'MembershipService',
    function ($rootScope, $scope, $state, $sessionStorage, $timeout, Response, $uibModalInstance, confirmm, notiffy,
              $compile, StoreService, CONSTANTS, PaymentService, $window, membership, extraHrs, MembershipService) {

      var vm = this;

      vm.user = $sessionStorage.userToken;
      vm.userId = $sessionStorage.userToken.id;
      vm.membership = membership;
      vm.extraHrs = extraHrs;

      vm.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };

      function getMembershipQuantity(membership) {
        return membership.type == "EXTRA_HOUR" ? vm.extraHrs : 1;
      }

      vm.paypal = function () {
        vm.loading = true;
        PaymentService.oauth().then(function () {

          $sessionStorage.paypalToken = Response.token;
          var membershipQty = getMembershipQuantity(vm.membership);
          var total = vm.membership.price * membershipQty;
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
                  "total": total,
                  "currency": "MXN"
                },
                "description": vm.userId,
                "item_list": {
                  "items": [
                    {
                      "name": vm.membership.name,
                      "sku": vm.membership.id,
                      "price": vm.membership.price,
                      "currency": "MXN",
                      "quantity": membershipQty,
                      "description": vm.membership.name,
                      "tax": "0.00"
                    }
                  ]
                }
              }
            ]
          };
          if (vm.membership.type == "EXTRA_HOUR") {
            vm.membership.hours = membershipQty;
            vm.membership.price = vm.membership.price * membershipQty;
          }

          PaymentService.createPayment(buy).then(function () {
            vm.payPalResponse = Response.payPalResponse;
            $sessionStorage.buyedMembership = vm.membership;
            $window.location.href = vm.payPalResponse.links[1].href;
          }, function () {
            notiffy.error('Error al obtener generar el pago.');
            vm.loading = false;
          });

        }, function () {
          notiffy.error('Error al obtener el token de paypal.');
          vm.loading = false;
        });
      };

      vm.transferPayment = function () {
        vm.loading = true;
        PaymentService.transferPayment(vm.userId).then(function () {
          vm.loading = false;
          $uibModalInstance.close();
        }, function () {
          notiffy.error('Error.');
          vm.loading = false;
        });
      };

      /************************ Credit Card ***********************/

      vm.chooseCC = function () {
        vm.creditCard = true;

        // vm.buy = {
        //   card: {
        //     name: "ARMANDO I. REYNA A.",
        //     number: "4242424242424242",
        //     exp_year: "2019",
        //     exp_month: "02",
        //     cvc: "645",
        //     adress: {
        //       street1: "Porto Alegre 279",
        //       street2: "Int. San Blas 202",
        //       city: "Mexico",
        //       state: "Ciudad de Mexico",
        //       zip: "09440",
        //       country: "Mexico"
        //     }
        //   }
        // };

      };

      var validateExpirationDate = function () {
        if (vm.expirationDate) {
          $scope.buyForm.creditCardExpirationDate.$setValidity("date", true);
          var dates = vm.expirationDate.split("/");
          if (dates.length < 2) {
            $scope.buyForm.creditCardExpirationDate.$setValidity("date", false);
          } else {
            vm.buy.card.exp_month = parseInt(dates[0]);
            vm.buy.card.exp_year = parseInt(dates[1]);
            if (vm.buy.card.exp_month > 12) {
              $scope.buyForm.creditCardExpirationDate.$setValidity("date", false);
            } else {
              if (vm.buy.card.exp_year < 2016) {
                $scope.buyForm.creditCardExpirationDate.$setValidity("date", false);
              }
            }
          }
        }
      };

      vm.conekta = function () {
        validateExpirationDate();
        $scope.buyForm.$setDirty(true);
        if ($scope.buyForm.$valid) {

          Conekta.setPublishableKey(CONSTANTS.CONEKTA.KEY);

          vm.loading = true;
          Conekta.token.create(vm.buy, function (token) {

            var conektaPayment = angular.copy(vm.buy.card.adress);
            conektaPayment.token = token.id;
            conektaPayment.userId = vm.userId;
            conektaPayment.membershipId = vm.membership.id;
            conektaPayment.quantity = getMembershipQuantity(vm.membership);
            conektaPayment.amount = vm.membership.price * conektaPayment.quantity * 100;
            conektaPayment.description = vm.membership.name;
            conektaPayment.currency = 'MXN';

            PaymentService.conekta(conektaPayment).then(function () {
              vm.loading = false;
              vm.conektaResponse = Response.conektaResponse;

              if (vm.conektaResponse) {
                vm.loading = true;
                MembershipService.processPayPalResponse({
                    userId: vm.userId,
                    membershipId: vm.membership.id,
                    hours: conektaPayment.quantity,
                    total: conektaPayment.amount,
                    paymentMethod : CONSTANTS.PAYMENT_METHOD.CC
                  }
                ).then(function () {
                  vm.loading = false;
                  if (Response.payPalResponse.status == 'failure') {
                    $uibModalInstance.close();
                    confirmm.error("Error, no se ha podido procesar su pago correctamente.");
                  } else {
                    $uibModalInstance.close();
                    $sessionStorage.newPayment = true;
                    $state.go('index.profile');
                  }
                }, function () {
                  vm.loading = false;
                  $uibModalInstance.close();
                  confirmm.error("Error, su pago se ha procesado pero hubo un problema con su membres\u00EDa, contacte a un administrador.");
                });
              } else {
                confirmm.error('Su pago ha sido rechazado por su entidad bancaria.');
              }

            }, function (data) {
              vm.loading = false;
              console.log(data);
              notiffy.error('Error.');
            });

          }, function (data) {
            console.log(data);
            delete vm.buy;
            confirmm.error('La informaci\u00F3n ingresada es incorrecta, verifica e intenta de nuevo por favor.');
          });

        }
      };

    }
  ]);
})();