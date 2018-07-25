(function () {
  'use strict';

  var module = angular.module('aurora');

  module.controller('BranchCtrl', [
    '$rootScope', '$scope', '$state', '$sessionStorage', '$timeout', 'BranchService', 'CONSTANTS', 'Response', '$uibModal', 'confirmm', 'notiffy',
    function ($rootScope, $scope, $state, $sessionStorage, $timeout, BranchService, CONSTANTS, Response, $uibModal, confirmm, notiffy) {
      var vm = this;

      vm.inactiveBranches = false;
      vm.updateEnabled = false;
      vm.deactivateEnabled = false;
      vm.activateEnabled = false;
      vm.allselected = false;

      vm.refresh = function () {
        $scope.main.loading = true;
        var inactive = {
          inactive: vm.inactiveBranches
        };
        BranchService.getAll(inactive).then(function () {
          vm.branchList = Response.branchList;
          vm.allselected = false;
          $scope.main.loading = false;
        }, function () {
          notiffy.error('Error al obtener la lista de sucursales.');
          $scope.main.loading = false;
        });
      };

      vm.refresh();

      function getSelectedBranch() {
        var branchList = [];
        angular.forEach(vm.selectedList, function (branch, index) {
          if (branch.selected) {
            branchList.push(branch);
          }
        });
        return branchList.length == 1 ? branchList[0] : false;
      }

      vm.selectBranch = function (branch) {
        vm.selectedBranch = branch;
      };

      vm.clearSelectedBranch = function () {
        delete vm.selectedBranch;
      };

      vm.enableBts = function () {
        vm.selectedList = [];
        vm.activateEnabled = false;
        vm.deactivateEnabled = false;
        vm.updateEnabled = false;
        vm.allselected = true;
        angular.forEach(vm.branchList, function (branch, index) {
          if (branch.selected) {
            vm.selectedList.push(branch);
          } else {
            vm.allselected = false;
          }
        });
        if (vm.selectedList.length > 0) {
          vm.activateEnabled = true;
          vm.deactivateEnabled = true;
        }
        angular.forEach(vm.selectedList, function (branch, index) {
          if (branch.active) {
            vm.activateEnabled = false;
          } else {
            vm.deactivateEnabled = false;
          }
        });
        if (vm.selectedList.length == 1) {
          vm.updateEnabled = true;
        }

        vm.isStatusEditMode = false;
        if (vm.branch != undefined) {
          $scope.statusForm.$setPristine();
        }
      };

      vm.selectAll = function () {
        var select = !vm.allselected;
        angular.forEach(vm.branchList, function (branch, index) {
          branch.selected = select;
        });
        vm.enableBts();
      };

      vm.openBranchModal = function (update) {
        var modalInstance = $uibModal.open({
          templateUrl: 'views/branch/branches.modal.html',
          controller: 'BranchModalCtrl',
          controllerAs: 'vm',
          resolve: {
            branch: function () {
              if (update) {
                return vm.selectedList[0];
              } else {
                return undefined;
              }
            },
            nextOrder : function () {
              var sort = 0;
              vm.branchList.forEach(function (branch) {
                if(branch.sort > sort){
                  sort = branch.sort;
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

      vm.branchesActivate = function () {
        var message = '';
        angular.forEach(vm.selectedList, function (branch, index) {
          message += branch.name;
          if (index < vm.selectedList.length - 2) {
            message += ', ';
          } else if (index < vm.selectedList.length - 1) {
            message += ' y ';
          }
        });
        if (vm.selectedList.length > 1) {
          message = 'Desea activar las sucursales ' + message + '?';
        } else {
          message = 'Desea activar ' + message + '?';
        }
        confirmm.confirm(message, function () {
          vm.loading = true;
          BranchService.activate(vm.selectedList).then(function () {
            vm.loading = false;
            if (Response.activated) {
              if (vm.selectedList.lenght > 1) {
            	  notiffy.success('Sucursales activadas.');
              } else {
            	  notiffy.success('Sucursal activada.');
              }
            } else {
              notiffy.error('Error al activar sucursales.');
            }
            vm.refresh();
          }, function () {
            notiffy.error('Error al activar sucursales.');
          });
        });
      };

      vm.branchesDeactivate = function () {
        var message = '';
        angular.forEach(vm.selectedList, function (branch, index) {
          message += branch.name;
          if (index < vm.selectedList.length - 2) {
            message += ', ';
          } else if (index < vm.selectedList.length - 1) {
            message += ' y ';
          }
        });
        if (vm.selectedList.length > 1) {
          message = 'Desea inactivar las sucursales ' + message + '?';
        } else {
          message = 'Desea inactivar a ' + message + '?';
        }
        confirmm.confirm(message, function () {
          vm.loading = true;
          BranchService.deactivate(vm.selectedList).then(function () {
            vm.loading = false;
            if (Response.deactivated) {
              if (vm.selectedList.length > 1) {
            	  notiffy.success('Sucursales inactivadas.');
              } else {
            	  notiffy.success('Sucursal inactivada.');
              }
            } else {
              notiffy.error('Error al inactivar sucursales.');
            }
            vm.refresh();
          }, function () {
            notiffy.error('Error al inactivar sucursales.');
          });
        });
      };

      vm.showFilesSection = function (branch) {
        vm.selectBranch(branch);
        vm.getBranchFiles();
      };

      vm.files = [];

      vm.uploadBranchFile = function (file) {
        vm.file = file;
        if (vm.file) {
          vm.loading = true;
          BranchService.uploadFiles({
            file: vm.file
          }, {
            branchId: vm.selectedBranch.id
          }).then(function () {
            vm.loading = false;
            if (Response.uploadResult.status == 'success') {
              var files = [];
              files = Response.uploadResult.data;
              buildFileURL(files);
              notiffy.success(Response.uploadResult.message);
              vm.getBranchFiles();
            } else {
              notiffy.error(Response.uploadResult.message);
            }
          }, function () {
            vm.loading = false;
            notiffy.error('Error al subir el archivo.');
          });
        }
      };

      vm.deleteBranchFile = function (branchId, fileName) {
        var file = {
          branchId: branchId,
          fileName: fileName
        };
        confirmm.confirm("Desea eliminar el archivo: " + fileName, function () {
          vm.loading = true;
          BranchService.deleteFile(file).then(function () {
            if (Response.file.status == 'success') {
              notiffy.success(Response.file.message);
              vm.showFilesSection(vm.selectedBranch);
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

      vm.getBranchFiles = function () {
        vm.loading = true;
        BranchService.getFiles(vm.selectedBranch.id).then(function () {
          vm.loading = false;
          if (Response.files) {
            vm.files = Response.files;
            buildFileURL(vm.files);
          } else {
            notiffy.error('Error al obtener lista de archivos.');
          }
        }, function () {
          vm.loading = false;
          notiffy.error('Error al obtener lista de archivos.');
        });
      };

      vm.setFavoriteImage = function (branchId, favoriteImgName) {
        var file = {
          id: branchId,
          favoriteImgName: favoriteImgName
        };
        BranchService.setFavoriteImage(file).then(function () {
          vm.selectedBranch.favoriteImgName = Response.file.data.favoriteImgName;
          notiffy.success(Response.file.message);
        }, function () {
          notiffy.error('Error al asignar imagen favorita.');
        });
      };

      function buildFileURL(files) {
        angular.forEach(files, function (file, index) {
          file.url = 'branchId=' + vm.selectedBranch.id + '&fileName=' + file.name;
        });
      }

      vm.carouselModal = function (files, index) {
        $uibModal.open({
          templateUrl: 'views/common/carousel.modal.html',
          controller: 'BranchesCarouselModalCtrl',
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