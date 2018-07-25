(function () {
  'use strict';

  var module = angular.module('aurora');

  module.controller('AppointmentCtrl', [
    'CONSTANTS', '$rootScope', '$scope', '$state', '$sessionStorage', '$timeout', 'Response', '$uibModal', 'confirmm', 'notiffy',
    '$compile', 'AppointmentService', 'CubicleService', 'UserService', 'UtilService', 'BranchService', '$stateParams',
    function (CONSTANTS, $rootScope, $scope, $state, $sessionStorage, $timeout, Response, $uibModal, confirmm, notiffy, $compile,
              AppointmentService, CubicleService, UserService, UtilService, BranchService, $stateParams) {
      var vm = this;

      vm.calendarView = 'Month';

      vm.user = $sessionStorage.userToken;

      if ($stateParams.reload == 'true' && $sessionStorage.alreadyReloaded == 'false') {
        $sessionStorage.alreadyReloaded = 'true';
        window.location.reload();
      }

      UserService.refreshUser(vm.user.id).then(function () {
      }, function () {
        notiffy.error('Para ver la informaci\u00F3n actualizada de su membres\u00EDa por favor refresque la p\u00E1gina.');
      });

      vm.isLoggedUserAdmin = function () {
        var isAdmin = false;
        if (vm.user.role.id === CONSTANTS.ROLES.SUPER_ADMIN || vm.user.role.id === CONSTANTS.ROLES.BRANCH_ADMIN) {
          isAdmin = true;
        }
        return isAdmin;
      };

      vm.isAdmin = vm.isLoggedUserAdmin();

      vm.doctorList = [];
      if (vm.isAdmin) {
        AppointmentService.getDoctors().then(function () {
          $scope.main.loading = false;
          if (Response.doctor.status == 'success') {
            vm.doctorList = Response.doctor.data;
          } else {
            notiffy.error(Response.file.message);
          }
        }, function () {
          notiffy.error('Error al obtener doctores.');
        })
      }

      vm.isDirty = function () {
        return $scope.appointmentDate.$dirty && $scope.submitted;
      };

      vm.getBranches = function(){
        $scope.main.loading = true;
        var inactive = {
          inactive: false
        };
        BranchService.getAll(inactive).then(function () {
          $scope.main.loading = false;
          vm.branchList = Response.branchList;
          buildBranchFileURL(vm.branchList);
        }, function () {
          notiffy.error('Error al obtener la lista de sucursales.');
          $scope.main.loading = false;
        });
      };

      vm.getBranches();

      vm.selectBranch = function (branch) {
        vm.selectedBranch = branch;
      };

      vm.clearBranch = function () {
        delete vm.cubicleType;
        delete vm.selectedCubicle;
        delete vm.selectedBranch;
      };

      vm.loadCubicles = function () {
        $scope.main.loading = true;
        var filters = {
          cubicleType: vm.cubicleType,
          branch: vm.selectedBranch
        };
        CubicleService.getCubicles(filters).then(function () {
          $scope.main.loading = false;
          vm.cubicles = Response.cubicleList;
          buildFileURL(vm.cubicles);
        }, function () {
          $scope.main.loading = false;
          notiffy.error('Error al obtener la lista de cubículos.');
        });
      };

      vm.getUserAppointments = function () {
        $scope.main.loading = true;
        var inactive = {
          inactive: false
        };
        AppointmentService.getUserAppointments(vm.user.id).then(function () {
          $scope.main.loading = false;
          if (Response.appointments.status == 'failure') {
            notiffy.error(Response.cubicles.message);
            return;
          }
          vm.cubicles = Response.cubicles.data;
        }, function () {
          notiffy.error('Error al obtener la lista de citas.');
          $scope.main.loading = false;
        });
      };

      vm.clearSelectedView = function () {
        delete vm.cubicleType;
        delete vm.selectedCubicle;
      };

      vm.setCubicleType = function (cubicleType) {
        vm.clearSelectedView();
        vm.cubicleType = cubicleType;
        vm.loadCubicles();
      };

      vm.showGalleryView = function (cubicle) {
        $scope.main.loading = true;
        CubicleService.getCubicleFiles(cubicle.id).then(function () {
          $scope.main.loading = false;
          if (Response.result) {
            vm.files = Response.result;
            buildGalleryURLs(cubicle, vm.files);
            vm.carouselModal(vm.files, 0);
          } else {
            notiffy.error('Error al obtener lista de archivos.');
          }
        }, function () {
          $scope.main.loading = false;
          notiffy.error('Error al obtener lista de archivos.');
        });
        $("#calendarWrapper").css("margin-left", "1000000000000px");
      };

      vm.showCalendar = function (cubicle) {
        vm.selectedCubicle = cubicle;
        $scope.main.loading = true;
        $timeout(function(){
          $scope.main.loading = false;
        }, 1000);
      };

      function buildFileURL(items) {
        angular.forEach(items, function (item, index) {
          item.url = CONSTANTS.API_URI + 'cubicle/view-file?' + 'cubicleId=' + item.id + '&fileName=' + item.favoriteImgName;
        });
      }

      function buildGalleryURLs(cubicle, items) {
        angular.forEach(items, function (item, index) {
          item.url = 'cubicleId=' + cubicle.id + '&fileName=' + item.name;
        });
      }

      vm.carouselModal = function (files, index) {
        $uibModal.open({
          templateUrl: 'views/common/carousel.modal.html',
          controller: 'CubilclesCarouselModalCtrl',
          controllerAs: 'vm',
          resolve: {
            files: function () {
              return files;
            },
            index: function () {
              return index;
            }
          }
        });
      };

      function buildBranchFileURL(items) {
        angular.forEach(items, function (item, index) {
          item.url = CONSTANTS.API_URI + 'branch/view-file?' + 'branchId=' + item.id + '&fileName=' + item.favoriteImgName;
        });
      }

    }
  ]);
})();