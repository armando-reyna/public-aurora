(function () {
  'use strict';

  var module = angular.module('aurora');

  module.controller('LeadsCtrl', [
    '$sce','$rootScope', '$scope', '$state', '$sessionStorage', '$timeout', 'LeadsService', 'Response', '$uibModal', 'confirmm', 'notiffy','CONSTANTS',
    function ($sce, $rootScope, $scope, $state, $sessionStorage, $timeout, LeadsService, Response, $uibModal, confirmm, notiffy, CONSTANTS) {

      var vm = this;

      vm.inactiveLeads = false;
      vm.updateEnabled = false;
      vm.deactivateEnabled = false;
      vm.activateEnabled = false;
      vm.allselected = false;

      vm.user = $sessionStorage.userToken;

      vm.refresh = function () {
        $scope.main.loading = true;
        var inactive = {
          inactive: vm.inactiveLeads
        };
        if(vm.user.role.id === CONSTANTS.ROLES.BRANCH_ADMIN){
          inactive.branchId = vm.user.branch.id;
        }
        LeadsService.getLeads(inactive).then(function () {
          vm.leadList = Response.leadList;
          vm.allselected = false;
          $scope.main.loading = false;
        }, function () {
          notiffy.error('Error al obtener la lista de leads.');
          $scope.main.loading = false;
        });

        LeadsService.getExecutives().then(function () {
          vm.executives = Response.executiveList;
          $scope.main.loading = false;
        }, function () {
          notiffy.error('Error al obtener la lista de Ejecutivos.');
          $scope.main.loading = false;
        });
      };

      vm.refresh();

      vm.openExecutiveModal = function (update) {
        var modalInstance = $uibModal.open({
          templateUrl: 'views/leads/executive.modal.html',
          controller: 'ExecutiveModalCtrl',
          controllerAs: 'vm',
          resolve: {
            lead: function () {
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
        });
      };

      vm.openLeadModal = function (isUpdate) {
        var modalInstance = $uibModal.open({
          templateUrl: 'views/leads/leads.modal.html',
          controller: 'LeadsModalCtrl',
          controllerAs: 'vm',
          resolve: {
            lead: function () {
              if (isUpdate) {
                var model = vm.selectedList[0];
                model.isUpdate = true;
                return model;
              } else {
                return {isUpdate: false};
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

      vm.selectLead = function (lead) {
        vm.selectedLead = lead;
        vm.getLeadFiles();
      };

      vm.deleteFile = function(file) {
    	  var file = {
            leadId: vm.selectedLead.id,
    	    fileName: file.name
    	  };
        confirmm.confirm("Desea eliminar el archivo: " + file.fileName, function () {
          vm.loading = true;
          LeadsService.deleteFile(file).then(function () {
            if (Response.file.status == 'success') {
              notiffy.success(Response.file.message);
              vm.selectLead(vm.selectedLead);
              vm.loading = false;
            } else {
              notiffy.error('Error al inactivar los leads.');
              vm.loading = false;
            }
          }, function () {
            notiffy.error('Error al borrar archivo.');
            vm.loading = false;
          });
        });
      };

      vm.clearSelectedLead = function () {
        delete vm.selectedLead;
      };

      vm.enableBts = function () {
        vm.selectedList = [];
        vm.activateEnabled = false;
        vm.deactivateEnabled = false;
        vm.updateEnabled = false;
        vm.allselected = true;
        angular.forEach(vm.leadList, function (lead, index) {
          if (lead.selected) {
            vm.selectedList.push(lead);
          } else {
            vm.allselected = false;
          }
        });
        if (vm.selectedList.length > 0) {
          vm.activateEnabled = true;
          vm.deactivateEnabled = true;
        }
        angular.forEach(vm.selectedList, function (lead, index) {
          if (lead.active) {
            vm.activateEnabled = false;
          } else {
            vm.deactivateEnabled = false;
          }
        });
        if (vm.selectedList.length == 1) {
          vm.updateEnabled = true;
        }

        vm.selectedLead = getSelectedLead();
        vm.isStatusEditMode = false;
        if (vm.lead != undefined) {
          vm.lead.status = '';
          $scope.statusForm.$setPristine();
        }
      };

      vm.selectAll = function () {
        var select = !vm.allselected;
        angular.forEach(vm.leadList, function (lead, index) {
          lead.selected = select;
        });
        vm.enableBts();
      };

      vm.activateLeads = function () {
        var message = '';
        angular.forEach(vm.selectedList, function (lead, index) {
          message += lead.name;
          if (index < vm.selectedList.length - 2) {
            message += ', ';
          } else if (index < vm.selectedList.length - 1) {
            message += ' y ';
          }
        });
        if (vm.selectedList.length > 1) {
          message = 'Desea activar a los leads ' + message + '?';
        } else {
          message = 'Desea activar a ' + message + '?';
        }
        confirmm.confirm(message, function () {
          vm.loading = true;
          var selectedLeads = getSelectedLeadIds();
          LeadsService.activate(selectedLeads).then(function () {
            vm.loading = false;
            if (Response.activated) {
              notiffy.success('Leads activados.');
            } else {
              notiffy.error('Error al activar los leads.');
            }
            vm.refresh();
          }, function () {
            notiffy.error('Error al activar los leads.');
          });
        });
      };


      vm.deactivateLeads = function () {
        var message = '';
        angular.forEach(vm.selectedList, function (lead, index) {
          message += lead.name;
          if (index < vm.selectedList.length - 2) {
            message += ', ';
          } else if (index < vm.selectedList.length - 1) {
            message += ' y ';
          }
        });
        if (vm.selectedList.length > 1) {
          message = 'Desea inactivar a los leads ' + message + '?';
        } else {
          message = 'Desea inactivar a ' + message + '?';
        }
        confirmm.confirm(message, function () {
          vm.loading = true;
          var selectedLeads = getSelectedLeadIds();
          LeadsService.deactivate(selectedLeads).then(function () {
            vm.loading = false;
            if (Response.deactivated) {
              notiffy.success('Leads inactivados.');
            } else {
              notiffy.error('Error al inactivar los leads.');
            }
            vm.refresh();
          }, function () {
            notiffy.error('Error al inactivar los leads.');
          });
        });
      };

      function getSelectedLeadIds() {
        var leadsList = [];
        angular.forEach(vm.selectedList, function (lead, index) {
          leadsList.push(lead.id);
        });
        return leadsList;
      }

      function getSelectedLead() {
        var leadsList = [];
        angular.forEach(vm.selectedList, function (lead, index) {
          if (lead.selected) {
            leadsList.push(lead);
          }
        });
        return leadsList.length == 1 ? leadsList[0] : false;
      }

      // COMMENTS BUSINESS LOGIC
      vm.saveComment = function () {
        vm.loading = true;
        var lead = vm.selectedLead;
        if (lead) {
          $scope.commentsForm.$setDirty(true);
          LeadsService.saveComment(
            {id: lead.id, comment: vm.lead.comment}
          ).then(function () {
            if (Response.comment) {
              vm.selectedLead.comments.unshift(Response.comment);
              vm.lead.comment = undefined;
              notiffy.success('Se ha registrado exitosamente.');
              vm.loading = false;
            } else {
              notiffy.error('Error al guardar la informaci\u00F3n, intente nuevamente.');
              vm.loading = false;
            }
          });
        }
      };

      vm.deleteComment = function (commentId, userId) {
        $scope.commentsForm.$setDirty(true);
        LeadsService.deleteComment(
          commentId
        ).then(function () {
          if (Response.saved) {
            vm.getCommentsByLead(vm.selectedLead.id);
            notiffy.success('Se ha eliminado exitosamente.');
          } else {
            notiffy.error('Error al guardar la informaci\u00F3n, intente nuevamente.');
          }
        });
      };

      vm.getLeadStatus = function () {
        LeadsService.getLeadStatus().then(function () {
          if (!Response.leadStatusList) {
            notiffy.error('Error al cargar lista de estatus.');
          }
          vm.leadStatus = Response.leadStatusList;
        });
      };

      vm.getLeadStatus();

      vm.saveStatus = function () {
        LeadsService.saveStatus({
          leadId: vm.selectedLead.id,
          statusId: vm.lead.status.id
        }).then(function () {
          if (Response.status) {
            notiffy.success('Se ha registrado exitosamente.');
            vm.loading = false;
            vm.isStatusEditMode = false;
            vm.selectedLead.status = Response.status;
          } else {
            notiffy.error('Error al guardar la informaci\u00F3n, intente nuevamente.');
            vm.loading = false;
            vm.isStatusEditMode = true;
          }
        });
      };

      vm.isStatusEditMode = false;
      vm.changeStatusEditMode = function () {
        vm.isStatusEditMode = true;
      };


      vm.cancelStatus = function () {
        vm.isStatusEditMode = false;
        $scope.statusForm.$setPristine();
      };

      vm.getCommentsByLead = function () {
        vm.loading = true;
        LeadsService.getCommentsByLead(vm.selectedLead.id).then(function () {
          vm.loading = false;
          if (Response.comments) {
            vm.selectedLead.comments = Response.comments;
          }
          if (Response.status == 'failure') {
            notiffy.error('Error al obtener los comentarios.');
          }

        }, function () {
          notiffy.error('Error al obtener los comentarios.');
        });
      };

      vm.files = [];
      vm.invalidFiles = [];
      vm.uploadFile = function (file) {
        vm.file = file;
        if (vm.file) {

          vm.loading = true;
          LeadsService.uploadFile({
            file: vm.file}, {
            leadId: vm.selectedLead.id
          }).then(function() {
            vm.loading = false;
            if (Response.uploadResult.status == 'success') {
              var files = [];
              files = Response.uploadResult.data;
              buildFileURL(files);
              notiffy.success(Response.uploadResult.message);
              vm.getLeadFiles();

            }else{
              notiffy.error(Response.uploadResult.message);
            }
          }, function() {
            vm.loading = false;
            notiffy.error('Error al subir el archivo.');
          });

        } else {
          vm.isOverMaxSize = true;
        }
      };

      vm.getLeadFiles = function () {
        vm.loading = true;
        LeadsService.getLeadFiles(vm.selectedLead.id).then(function() {
          vm.loading = false;
          if (Response.result) {
            vm.files = Response.result;
            buildFileURL(vm.files);
          }else{
            notiffy.error('Error al obtener lista de archivos.');
          }
        }, function(){
          vm.loading = false;
          notiffy.error('Error al obtener lista de archivos.');
        });
      };

      function buildFileURL(files) {
        angular.forEach(files, function (file, index) {
          file.fileURL = 'leadId=' + vm.selectedLead.id + '&fileName=' + file.name;
        });
      }

    }]);
})();