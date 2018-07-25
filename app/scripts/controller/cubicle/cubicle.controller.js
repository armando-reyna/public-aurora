(function () {
  'use strict';

  var module = angular.module('aurora');

  module.controller('CubicleCtrl', [
    '$rootScope', '$scope', '$state', '$sessionStorage', '$timeout', 'CubicleService', 'BranchService', 'CONSTANTS', 'Response', '$uibModal', 'confirmm', 'notiffy',
    function ($rootScope, $scope, $state, $sessionStorage, $timeout, CubicleService, BranchService, CONSTANTS, Response, $uibModal, confirmm, notiffy) {
      var vm = this;

      vm.inactiveCubicles = false;
      vm.updateEnabled = false;
      vm.deactivateEnabled = false;
      vm.activateEnabled = false;
      vm.allselected = false;

      vm.user = $sessionStorage.userToken;

      if(vm.user.role.id === CONSTANTS.ROLES.BRANCH_ADMIN){
        vm.branch = vm.user.branch;
      }

      vm.refresh = function () {
        $scope.main.loading = true;
        var filters = {
          active: !vm.inactiveCubicles,
          branch: vm.branch
        };
        CubicleService.getCubicles(filters).then(function () {
          $scope.main.loading = false;
          vm.cubicleList = Response.cubicleList;
          vm.allselected = false;
        }, function () {
          notiffy.error('Error al obtener la lista de cubículos.');
          $scope.main.loading = false;
        });
      };

      vm.refresh();

      vm.getBranches = function(){
        $scope.main.loading = true;
        var inactive = {
          inactive: false
        };
        BranchService.getAll(inactive).then(function () {
          vm.branchList = Response.branchList;
          $scope.main.loading = false;
        }, function () {
          notiffy.error('Error al obtener la lista de sucursales.');
          $scope.main.loading = false;
        });
      };

      vm.getBranches();

      vm.selectCubicle = function (cubicle) {
        vm.selectedCubicle = cubicle;
      };

      vm.clearSelectedCubicle = function () {
        delete vm.selectedCubicle;
      };

      vm.enableBts = function () {
        vm.selectedList = [];
        vm.activateEnabled = false;
        vm.deactivateEnabled = false;
        vm.updateEnabled = false;
        vm.allselected = true;
        angular.forEach(vm.cubicleList, function (cubicle, index) {
          if (cubicle.selected) {
            vm.selectedList.push(cubicle);
          } else {
            vm.allselected = false;
          }
        });
        if (vm.selectedList.length > 0) {
          vm.activateEnabled = true;
          vm.deactivateEnabled = true;
        }
        angular.forEach(vm.selectedList, function (cubicle, index) {
          if (cubicle.active) {
            vm.activateEnabled = false;
          } else {
            vm.deactivateEnabled = false;
          }
        });
        if (vm.selectedList.length == 1) {
          vm.updateEnabled = true;
        }

        vm.isStatusEditMode = false;
        if (vm.cubicle != undefined) {
          $scope.statusForm.$setPristine();
        }
      };

      vm.selectAll = function () {
        var select = !vm.allselected;
        angular.forEach(vm.cubicleList, function (cubicle, index) {
          cubicle.selected = select;
        });
        vm.enableBts();
      };

      vm.openCubicleModal = function (update) {
        var modalInstance = $uibModal.open({
          templateUrl: 'views/cubicle/cubicles.modal.html',
          controller: 'CubicleModalCtrl',
          controllerAs: 'vm',
          resolve: {
            cubicle: function () {
              if (update) {
                return vm.selectedList[0];
              } else {
                return undefined;
              }
            },
            nextOrder : function () {
              var sort = 0;
              vm.cubicleList.forEach(function (cubicle) {
                if(cubicle.sort > sort){
                  sort = cubicle.sort;
                }
              });
              return sort + 1;
            }
          }
        });
        modalInstance.result.then(function (selectedItem) {
          vm.refresh();
        }, function () {
        });
      };

      vm.cubiclesActivate = function () {
        var message = '';
        angular.forEach(vm.selectedList, function (cubicle, index) {
          message += cubicle.name;
          if (index < vm.selectedList.length - 2) {
            message += ', ';
          } else if (index < vm.selectedList.length - 1) {
            message += ' y ';
          }
        });
        if (vm.selectedList.length > 1) {
          message = 'Desea activar los cubículos ' + message + '?';
        } else {
          message = 'Desea activar ' + message + '?';
        }
        confirmm.confirm(message, function () {
          vm.loading = true;
          CubicleService.cubiclesActivate(vm.selectedList).then(function () {
            vm.loading = false;
            if (Response.activated) {
              if (vm.selectedList.lenght > 1) {
            	  notiffy.success('Cubículos activados.');
              } else {
            	  notiffy.success('Cubículo activado.');
              }
            } else {
              notiffy.error('Error al activar cubículo(s).');
            }
            vm.refresh();
          }, function () {
            notiffy.error('Error al activar cubículo(s).');
          });
        });
      };

      vm.cubiclesDeactivate = function () {
        var message = '';
        angular.forEach(vm.selectedList, function (cubicle, index) {
          message += cubicle.name;
          if (index < vm.selectedList.length - 2) {
            message += ', ';
          } else if (index < vm.selectedList.length - 1) {
            message += ' y ';
          }
        });
        if (vm.selectedList.length > 1) {
          message = 'Desea inactivar los cubículos ' + message + '?';
        } else {
          message = 'Desea inactivar a ' + message + '?';
        }
        confirmm.confirm(message, function () {
          vm.loading = true;
          CubicleService.cubiclesDeactivate(vm.selectedList).then(function () {
            vm.loading = false;
            if (Response.deactivated) {
              if (vm.selectedList.length > 1) {
            	  notiffy.success('Cubículos inactivados.');  
              } else {
            	  notiffy.success('Cubículo inactivado.');
              }
            } else {
              notiffy.error('Error al inactivar cubículo(s).');
            }
            vm.refresh();
          }, function () {
            notiffy.error('Error al inactivar cubículo(s).');
          });
        });
      };

      vm.showFilesSection = function (cubicle) {
        vm.selectCubicle(cubicle);
        vm.getCubicleFiles();
      };

      vm.files = [];

      vm.uploadCubicleFile = function (file) {
        vm.file = file
        if (vm.file) {
          vm.loading = true;
          CubicleService.uploadCubicleFile({
            file: vm.file
          }, {
            cubicleId: vm.selectedCubicle.id
          }).then(function () {
            vm.loading = false;
            if (Response.uploadResult.status == 'success') {
              var files = [];
              files = Response.uploadResult.data;
              buildFileURL(files);
              notiffy.success(Response.uploadResult.message);
              vm.getCubicleFiles();
            } else {
              notiffy.error(Response.uploadResult.message);
            }
          }, function () {
            vm.loading = false;
            notiffy.error('Error al subir el archivo.');
          });
        }
      };

      vm.deleteCubicleFile = function (cubicleId, fileName) {
        var file = {
          cubicleId: cubicleId,
          fileName: fileName
        };
        confirmm.confirm("Desea eliminar el archivo: " + fileName, function () {
          vm.loading = true;
          CubicleService.deleteCubicleFile(file).then(function () {
            if (Response.file.status == 'success') {
              notiffy.success(Response.file.message);
              vm.showFilesSection(vm.selectedCubicle);
              vm.loading = false;
            } else {
              notiffy.error('Error al eliminar archivo.');
              vm.loading = false;
            }
          }, function () {
            notiffy.error('Error al borrar archivo.');
            vm.loading = false;
          });
        });
      };

      vm.getCubicleFiles = function () {
        vm.loading = true;
        CubicleService.getCubicleFiles(vm.selectedCubicle.id).then(function () {
          vm.loading = false;
          if (Response.result) {
            vm.files = Response.result;
            buildFileURL(vm.files);
          } else {
            notiffy.error('Error al obtener lista de archivos.');
          }
        }, function () {
          vm.loading = false;
          notiffy.error('Error al obtener lista de archivos.');
        });
      };

      vm.setFavoriteImage = function (cubicleId, favoriteImgName) {
        var file = {
          id: cubicleId,
          favoriteImgName: favoriteImgName
        };
        CubicleService.setFavoriteImage(file).then(function () {
          vm.selectedCubicle.favoriteImgName = Response.file.data.favoriteImgName;
          notiffy.success(Response.file.message);
        }, function () {
          notiffy.error('Error al asignar imagen favorita.');
        });
      };

      function buildFileURL(files) {
        angular.forEach(files, function (file, index) {
          file.url = 'cubicleId=' + vm.selectedCubicle.id + '&fileName=' + file.name;
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

    }
  ]);
})();