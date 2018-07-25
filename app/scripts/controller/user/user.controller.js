(function () {
  'use strict';

  var module = angular.module('aurora');

  module.controller('UserCtrl', [
    'CONSTANTS', '$rootScope', '$scope', '$state', '$sessionStorage', '$timeout', 'UserService', 'Response', '$uibModal',
    'confirmm', 'StoreService', 'notiffy', 'MembershipService',
    function (CONSTANTS, $rootScope, $scope, $state, $sessionStorage, $timeout, UserService, Response, $uibModal, confirmm,
              StoreService, notiffy, MembershipService) {

      var vm = this;

      vm.userToken = $sessionStorage.userToken;

      vm.inactiveUsers = false;
      vm.updateEnabled = false;
      vm.deactivateEnabled = false;
      vm.activateEnabled = false;
      vm.allselected = false;
      vm.isShowStore = false;
      vm.isShowUsers = true;
      vm.memberships = [];
      vm.extraHour = null;
      vm.originalAccountHrs = 0;
      vm.allMemberships = [];
      vm.selectedMembership = null;
      vm.isShowDetails = false;
      vm.showUpHours = false;
      vm.showRawMembership = false;
      vm.total = 0;
      vm.onlyClients = true;

      vm.refresh = function () {
        $scope.main.loading = true;
        var postObj = {
          inactive: vm.inactiveUsers,
          onlyClients: vm.onlyClients
        };
        if (vm.userToken.role.id === CONSTANTS.ROLES.BRANCH_ADMIN) {
          postObj.branchId = vm.userToken.branch.id;
        }
        UserService.getUsers(postObj).then(function () {
          vm.userList = Response.userList;
          vm.allselected = false;
          vm.enableBts();
          $scope.main.loading = false;
        }, function () {
          notiffy.error('Error al obtener la lista de usuarios.');
          $scope.main.loading = false;
        });
      };

      vm.refresh();

      vm.openUserModal = function (update) {
        var modalInstance = $uibModal.open({
          templateUrl: 'views/user/user.modal.html',
          controller: 'UserModalCtrl',
          controllerAs: 'vm',
          resolve: {
            user: function () {
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

      vm.enableBts = function () {
        vm.selectedList = [];
        vm.activateEnabled = false;
        vm.deactivateEnabled = false;
        vm.updateEnabled = false;
        vm.allselected = true;
        angular.forEach(vm.userList, function (user, index) {
          if (user.selected) {
            vm.selectedList.push(user);
          } else {
            vm.allselected = false;
          }
        });
        if (vm.selectedList.length > 0) {
          vm.activateEnabled = true;
          vm.deactivateEnabled = true;
        }
        angular.forEach(vm.selectedList, function (user, index) {
          if (user.active) {
            vm.activateEnabled = false;
          } else {
            vm.deactivateEnabled = false;
          }
        });
        if (vm.selectedList.length == 1) {
          vm.updateEnabled = true;
        }
      };

      vm.selectAll = function () {
        var select = !vm.allselected;
        angular.forEach(vm.userList, function (user, index) {
          user.selected = select;
        });
        vm.enableBts();
      };

      vm.activateUsers = function () {
        var message = '';
        angular.forEach(vm.selectedList, function (user, index) {
          message += user.name;
          if (index < vm.selectedList.length - 2) {
            message += ', ';
          } else if (index < vm.selectedList.length - 1) {
            message += ' y ';
          }
        });
        if (vm.selectedList.length > 1) {
          message = 'Desea activar a los usuarios ' + message + '?';
        } else {
          message = 'Desea activar a ' + message + '?';
        }
        confirmm.confirm(message, function () {
          vm.loading = true;
          UserService.activate(getSelectedUserIds()).then(function () {
            vm.loading = false;
            if (Response.activated) {
              notiffy.success('Usuarios activados.');
            } else {
              notiffy.error('Error al activar los usuarios.');
            }
            vm.refresh();
          }, function () {
            notiffy.error('Error al activar los usuarios.');
          });
        });
      };


      vm.deactivateUsers = function () {
        var message = '';
        angular.forEach(vm.selectedList, function (user, index) {
          message += user.name;
          if (index < vm.selectedList.length - 2) {
            message += ', ';
          } else if (index < vm.selectedList.length - 1) {
            message += ' y ';
          }
        });
        if (vm.selectedList.length > 1) {
          message = 'Desea inactivar a los usuarios ' + message + '?';
        } else {
          message = 'Desea inactivar a ' + message + '?';
        }
        confirmm.confirm(message, function () {
          vm.loading = true;
          UserService.deactivate(getSelectedUserIds()).then(function () {
            vm.loading = false;
            if (Response.deactivated) {
              notiffy.success('Usuarios inactivados.');
            } else {
              notiffy.error('Error al inactivar los usuarios.');
            }
            vm.refresh();
          }, function () {
            notiffy.error('Error al inactivar los usuarios.');
          });
        });
      };

      function getSelectedUserIds() {
        var userIds = [];
        angular.forEach(vm.selectedList, function (user, index) {
          if (user.selected) {
            userIds.push(user.id);
          }
        });
        return userIds;
      }

      vm.showStore = function (selectedUser) {

        if (selectedUser) {
          vm.selectedList = [selectedUser];
        }

        vm.isShowStore = true;
        vm.isShowUsers = false;
        vm.allMemberships = [];
        vm.memberships = [];
        vm.extraHour = null;
        vm.showUpHours = false;
        vm.showRawMembership = false;
        vm.originalAccountHrs = vm.selectedList[0].membershipHrs ? vm.selectedList[0].membershipHrs : 0;
        $scope.main.loading = true;
        vm.total = 0;
        vm.extraHrs = 0;
        vm.hMembership = vm.originalAccountHrs;

        StoreService.getShoppableMemberships(vm.selectedList[0].id).then(function () {
          vm.allMemberships = Response.shoppableMemberships.data;
          UserService.getCurrentMembership(vm.selectedList[0].id).then(function () {
            vm.currentMembership = Response.currentMembership.data;
            if (vm.allMemberships != undefined) {
              for (var i = 0; i < vm.allMemberships.length; i++) {
                if (vm.allMemberships[i].group == 1) {
                  // Membership
                  vm.memberships.push(vm.allMemberships[i]);
                  vm.showRawMembership = true;
                } else if (vm.allMemberships[i].group == 2) {
                  // buy hours
                  vm.extraHour = vm.allMemberships[i];
                  vm.extraHour.price = vm.allMemberships[i].costPerHr;
                  vm.showUpHours = true;
                } else if (vm.allMemberships[i].group == 3 || vm.allMemberships[i].group == 4 || vm.allMemberships[i].group == 5) {
                  //upgrade
                  vm.memberships.push(vm.allMemberships[i]);
                }
              }
            }

          }, function () {
            notiffy.error('Error al obtener membres\u00EDas');
            $scope.main.loading = false;
          });
          $scope.main.loading = false;
        }, function () {
          notiffy.error('Error al obtener membres\u00EDas');
          $scope.main.loading = false;
        });
      };

      vm.updateSelectedMembership = function () {
        vm.isShowDetails = true;
        vm.hMembership = vm.originalAccountHrs;
        for (var i = 0; i < vm.allMemberships.length; i++) {
          if (vm.allMemberships[i].id == vm.membership) {
            vm.selectedMembership = vm.allMemberships[i];
            vm.total = vm.selectedMembership.price;
            break;
          }
        }

      };

      vm.updateSelectedHourw = function () {
        vm.membership = "";
        vm.hMembership = vm.originalAccountHrs + vm.extraHrs;
        if (vm.hMembership <= vm.originalAccountHrs) {
          vm.total = 0;
        } else {
          vm.total = vm.extraHour.price * (vm.hMembership - vm.originalAccountHrs);
        }
      };

      vm.backToUsers = function () {
        vm.isShowStore = false;
        vm.isShowUsers = true;

        vm.memberships = [];
        vm.membership = null;
        vm.extraHour = null;
        vm.allMemberships = [];
        vm.selectedMembership = null;
        vm.isShowDetails = false;
        vm.showUpHours = false;
        vm.showRawMembership = false;
        vm.hMembership = 0;
        vm.originalAccountHrs = 0;
      };

      vm.addHr = function () {
        if (vm.extraHrs < 99) {
          vm.extraHrs++;
          vm.updateSelectedHourw();
        }
      };

      vm.subsHr = function () {
        if (vm.extraHrs > 0) {
          vm.extraHrs--;
          vm.updateSelectedHourw();
        }
      };

      vm.saveMembership = function () {
        if (vm.hMembership == vm.originalAccountHrs && (vm.membership == undefined || vm.membership == null || vm.membership == "")) {
          notiffy.error('No hay cambios realizados a la membres\u00EDa del usuario.');
          return;
        }
        $scope.main.loading = true;
        //alert(vm.extraHour.id + " " + vm.hMembership);
        var usedMembership = vm.membership;
        if (vm.hMembership != vm.originalAccountHrs) {
          usedMembership = vm.extraHour.id;
        }

        var membershipDTO = {
          userId: vm.selectedList[0].id,
          membershipId: usedMembership,
          hours: vm.extraHrs,
          total: vm.total,
          paymentMethod: CONSTANTS.PAYMENT_METHOD.CASH
        };

        UserService.saveMembership(membershipDTO).then(function () {
          var membershipsResponse = Response.membership.data;
          if (Response.membership.status == 'failure') {
            notiffy.error('Error al obtener membresías');
          } else {
            notiffy.info('Cambios guardados exitosamente');
            vm.backToUsers();
          }
          $scope.main.loading = false;
          vm.refresh();
        }, function () {
          notiffy.error('Error al guardar los cambios');
          $scope.main.loading = false;
          vm.refresh();
        });

      };

      vm.sendReminder = function (userId) {
        $scope.main.loading = true;
        MembershipService.sendReminder(userId).then(function () {
          $scope.main.loading = false;
          notiffy.info('Se ha enviado un mensaje de recordatorio.');
        }, function () {
          $scope.main.loading = false;
          notiffy.error('Error al enviar el mensaje.');
        });
      };

    }]);

})();