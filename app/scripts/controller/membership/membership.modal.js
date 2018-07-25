(function () {
  'use strict';

  var module = angular.module('aurora');

  module.controller('MembershipModalCtrl', [
    'CONSTANTS', '$rootScope', '$scope', '$state', 'Response', '$uibModalInstance', 'notiffy', 'membership', '$log', 'MembershipService', 'CubicleService',
    function (CONSTANTS, $rootScope, $scope, $state, Response, $uibModalInstance, notiffy, membership, $log, MembershipService, CubicleService) {

      var vm = this;
      vm.membership = membership;
      vm.cubicleList = [];
      vm.items = [];
      vm.restrictedCubicles = [];
      vm.file = undefined;
      if (membership.isUpdate) {
        vm.action = 'Modificar';
        vm.membership.group = "" + vm.membership.group;
        vm.membership.isUpdate = true;
      } else {
        vm.action = 'Agregar';
      }

      vm.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };

      vm.isDirty = function () {
        return $scope.membershipForm.$dirty && $scope.submitted;
      };

      vm.setFile = function (file) {
        vm.file = file;
      };

      vm.savedMembershipId = 0;

      vm.save = function () {
        vm.loading = true;
        $scope.membershipForm.$setDirty(true);
        $scope.submitted = true;
        if ($scope.membershipForm.$valid) {
          MembershipService.save({
            id: vm.membership.id,
            name: vm.membership.name,
            group: vm.membership.group,
            hours: vm.membership.hours,
            price: vm.membership.price,
            unlimited: vm.membership.unlimited,
            cubicles: vm.demoOptions.selectedItems
          }).then(function () {
            if (Response.membershipResponse.status == 'success') {
              if (vm.file) {
                vm.savedMembershipId = Response.membershipResponse.data;
                MembershipService.uploadMembershipTypeImage({file: vm.file}, {id: vm.savedMembershipId}).then(function () {
                  vm.membershipFileResponse = Response.membershipFileResponse;
                  if (vm.membershipFileResponse.status == 'success') {
                    notiffy.info('Membresía actualizada correctamente.');
                  }
                  vm.loading = false;
                  $uibModalInstance.close();
                }, function () {
                  notiffy.error('Error al cargar lista de membresías');
                  vm.loading = false;
                });
              }
              else {
                $uibModalInstance.close();
                notiffy.info('Membresía actualizada correctamente.');
                vm.loading = false;
              }

              MembershipService.getMainMemberships().then(function () {
                membership.vm.imgUpdateFlag = (new Date).getTime();
                membership.vm.memberships = Response.membershipTypes.data;
                vm.loading = false;
              }, function () {
                notiffy.error('Error al cargar lista de membres\u00EDas');
                vm.loading = false;
              });
            } else {
              notiffy.error("Error al guardar membresía");
              vm.loading = false;
            }
          });
        }
      };

      vm.getActiveCubicles = function () {
        var inactive = {
          inactive: false
        };
        CubicleService.getCubicles(inactive).then(function () {
          vm.cubicleList = Response.cubicleList;
          if (vm.cubicleList != undefined && vm.cubicleList != null && vm.cubicleList.length > 0) {
            for (var i = 0; i < vm.cubicleList.length; i++) {
                vm.items.push(
                {
                    id: vm.cubicleList[i].id,
                    name: vm.cubicleList[i].name
                });
                if (vm.membership.isUpdate) {
                    for (var j = 0; j < vm.membership.limitedToCubicle.length; j++)   {
                        if (vm.restrictedCubicles.length < vm.membership.limitedToCubicle.length) {
                            vm.restrictedCubicles.push(
                                {
                                    id: vm.membership.limitedToCubicle[j].id,
                                    name: vm.membership.limitedToCubicle[j].name
                                });
                        }
                        if (vm.cubicleList[i].id == vm.membership.limitedToCubicle[j].id) {
                          vm.cubicleList.splice(i, 1);
                        }
                    }
                }
            }
          }
        }, function () {
          notiffy.error('Error al obtener la lista de cubículos.');
        });
      };

      vm.getActiveCubicles();

      $uibModalInstance.rendered.then(function() {
        vm.demoOptions = {
          title: '',
          filterPlaceHolder: 'Filtrar cubículos.',
          labelAll: 'Cubículo(s) disponibles',
          labelSelected: 'Membresía limitada a cubículo(s)',
          helpMessage: '',
          /* angular will use this to filter your lists */
          orderProperty: 'name',
          /* this contains the initial list of all items (i.e. the left side) */
          items: vm.items,
          /* this list should be initialized as empty or with any pre-selected items */
          selectedItems: vm.restrictedCubicles
        };
        $( "div.dualmultiselect button" ).css( "display", "none" );
      });

    }]);

})();
