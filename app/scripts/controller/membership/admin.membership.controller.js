(function () {
    'use strict';

    var module = angular.module('aurora');

    module.controller('AdminMembershipCtrl', [
        '$rootScope', '$scope', '$state', '$sessionStorage', '$timeout', 'Response', '$uibModal', 'confirmm', 'notiffy', '$compile', 'MembershipService', 'CONSTANTS',
        function ($rootScope, $scope, $state, $sessionStorage, $timeout, Response, $uibModal, confirmm, notiffy, $compile, MembershipService, CONSTANTS) {
        	var vm = this;
        	vm.memberships = null;
        	vm.loading = false;
        	vm.selectedList = [];
        	vm.activateEnabled = false;
            vm.deactivateEnabled = false;
            vm.updateEnabled = false;
            vm.allselected = false;
            vm.selectedMembership = null;
            vm.apiUrl = CONSTANTS.API_URI;

            vm.selectMembership = function (membership) {
                vm.selectedMembership = membership;
            };
        	vm.imgUpdateFlag;
        	vm.getAllMemberships = function () {
              vm.loading = true;
              MembershipService.getMainMemberships().then(function() {
                vm.imgUpdateFlag = (new Date).getTime();
	            vm.membershipResponse = Response.membershipTypes;
	            vm.memberships = vm.membershipResponse.data;
	            vm.loading = false;
	          }, function () {
	        	notiffy.error('Error al cargar lista de membres\u00EDas');
	            vm.loading = false;
	          });
            };

            function getSelectedMembership() {
                var membershipList = [];
                angular.forEach(vm.selectedList, function (membership, index) {
                  if (membership.selected) {
                    membershipList.push(membership);
                  }
                });
                return membershipList.length == 1 ? membershipList[0] : false;
            }
            
            vm.enableBts = function () {
                vm.selectedList = [];
                vm.activateEnabled = false;
                vm.deactivateEnabled = false;
                vm.updateEnabled = false;
                vm.allselected = true;
                angular.forEach(vm.memberships, function (membershipType, index) {
                  if (membershipType.selected) {
                    vm.selectedList.push(membershipType);
                  } else {
                    vm.allselected = false;
                  }
                });
                if (vm.selectedList.length > 0) {
                  vm.activateEnabled = true;
                  vm.deactivateEnabled = true;
                }
                angular.forEach(vm.selectedList, function (membershipType, index) {
                  if (membershipType.active) {
                    vm.activateEnabled = false;
                  } else {
                    vm.deactivateEnabled = false;
                  }
                });
                if (vm.selectedList.length == 1) {
                  vm.updateEnabled = true;
                  vm.deactivateEnabled = true;
                }

                vm.selectedMembership = getSelectedMembership();
                vm.isStatusEditMode = false;
                if (vm.membership != undefined) {
                  $scope.statusForm.$setPristine();
                }
              };
            
            vm.selectAll = function () {
              var select = !vm.allselected;
              angular.forEach(vm.memberships, function (membership, index) {
                membership.selected = select;
              });
              vm.enableBts();
            };
            
            vm.refresh = function() {
              vm.getAllMemberships();
            };
            
            vm.deleteMembership = function() {
                var message = '¿Est\u00E1 seguro de eliminar la membres\u00EDa? (' + vm.selectedMembership.name +
                    ') No podr\u00E1 recuperar la informaci\u00F3n.';

                confirmm.confirm(message, function () {
                    vm.loading = true;
                    MembershipService.deleteMembershipTypes(vm.selectedMembership.id).then(function() {
                        vm.membershipResponse = Response.membershipResponse;
                        if (vm.membershipResponse.status == 'failure') {
                            notiffy.error(vm.membershipResponse.message);
                        } else {
                            notiffy.info(vm.membershipResponse.message);
                        }
                        vm.loading = false;
                        vm.refresh();
                    }, function () {
                        notiffy.error('Error al eliminar membres\u00EDa');
                        vm.loading = false;
                    });
                });
            };
            
            vm.openMembershipTypeModal = function (isUpdate) {
	          var modalInstance = $uibModal.open({
	            templateUrl: 'views/membership/membership.modal.html',
	            controller: 'MembershipModalCtrl',
	            controllerAs: 'vm',
	            resolve: {
	            	membership: function () {
	                if (isUpdate) {
	                  var membership = vm.selectedList[0];
	                  membership.isUpdate = true;
                      membership.vm = vm;
	                  return membership;
	                } else {
	                  return {vm : vm, isUpdate: false};
	                }
	              }
	            }
              });
            };
            
            vm.getAllMemberships();
        	
        }
    ]);
})();