angular
  .module('aurora')
  .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

      $urlRouterProvider.otherwise("/index/main");

      $stateProvider
        .state('login', {
          url: "/login",
          templateUrl: "views/login.html",
          controller: "LoginCtrl",
          controllerAs: "vm",
          data: {pageTitle: 'Login', specialClass: 'gray-bg'}
        })
        .state('reset', {
          url: "/reset/:id/:key",
          templateUrl: "views/login.html",
          controller: "LoginCtrl",
          controllerAs: "vm",
          data: {pageTitle: 'Login', specialClass: 'gray-bg'}
        })
        .state('cancelapt', {
          url: "/cancelapt/:apt/:cancelKey",
          templateUrl: "views/login.html",
          controller: "LoginCtrl",
          controllerAs: "vm",
          data: {pageTitle: 'Login', specialClass: 'gray-bg'}
        })
        .state('lead', {
          url: "/lead-registration/{origin:int}",
          templateUrl: "views/leads/lead_registration.html",
          controller: "LeadRegistrationCtrl",
          controllerAs: "vm",
          data: {pageTitle: 'Lead Registration', specialClass: 'gray-bg'}
        })
        .state('leadRegistered', {
          url: "/lead-registration-complete/",
          templateUrl: "views/common/lead_registered.html",
          data: {pageTitle: 'Lead Registration Complete', specialClass: 'gray-bg'}
        })
        .state('500', {
          url: "/500",
          templateUrl: "views/common/500.html",
          data: {pageTitle: 'Server Error', specialClass: 'gray-bg'}
        })
        .state('index', {
          abstract: true,
          url: "/index",
          templateUrl: "views/common/content.html",
          controller: "IndexCtrl",
          controllerAs: "vm"
        })
        .state('index.profile', {
          url: "/profile",
          templateUrl: "views/common/profile.html",
          controller: "ProfileCtrl",
          controllerAs: "vm",
          data: {pageTitle: 'Mi Perfil'}
        })
        .state('index.main', {
          url: "/main",
          templateUrl: "views/home/home.html",
          controller: "HomeCtrl",
          controllerAs: "vm",
          data: {pageTitle: 'Inicio'}
        })
        .state('index.user', {
          url: "/user",
          templateUrl: "views/user/user.html",
          controller: "UserCtrl",
          controllerAs: "vm",
          data: {pageTitle: 'Usuarios y Roles'}
        })
        .state('index.leadReport', {
          url: "/reportes/lead",
          templateUrl: "views/reportes/reportes.html",
          controller: "ReportesCtrl",
          controllerAs: "vm",
          data: {
            pageTitle: 'Reporte Leads',
            type: 1
          }
        })
        .state('index.userReport', {
          url: "/reportes/user",
          templateUrl: "views/reportes/reportes.html",
          controller: "ReportesCtrl",
          controllerAs: "vm",
          data: {
            pageTitle: 'Reporte Usuarios',
            type: 2
          }
        })
        .state('index.collectionReport', {
          url: "/reportes/collection",
          templateUrl: "views/reportes/collection.report.html",
          controller: "ReportesCtrl",
          controllerAs: "vm",
          data: {
            pageTitle: 'Reporte Cobranza',
            type: 3
          }
        })
        .state('index.appointmentReport', {
          url: "/reportes/appointment",
          templateUrl: "views/reportes/appointment.report.html",
          controller: "AppointmentsReportCtrl",
          controllerAs: "vm",
          data: {
            pageTitle: 'Reporte Citas',
            type: 4
          }
        })
        .state('index.leads', {
          url: "/leads",
          templateUrl: "views/leads/leads.html",
          controller: "LeadsCtrl",
          controllerAs: "vm",
          data: {pageTitle: 'Leads'}
        })
        .state('index.leads-clients', {
          url: "/leads-clients",
          templateUrl: "views/leads/leads_clients.html",
          controller: "LeadsClientsCtrl",
          controllerAs: "vm",
          data: {pageTitle: 'Clientes'}
        })
        .state('index.leads-follow-up', {
          url: "/leads-follow-up",
          controller: "LeadsCtrl",
          controllerAs: "vm",
          templateUrl: "views/leads/leads_follow_up.html",
          data: {pageTitle: 'Seguimiento de Leads'}
        })
        .state('index.leads-upload-file', {
          url: "/leads-upload-file",
          templateUrl: "views/leads/leads_upload_file.html",
          controller: "LeadsCtrl",
          controllerAs: "vm",
          data: {pageTitle: 'Subir documentaci\u00F3n'}
        })
        .state('index.leads-bills', {
          url: "/leads-bills",
          templateUrl: "views/leads/leads_bills.html",
          controller: "LeadsBillsCtrl",
          controllerAs: "vm",
          data: {pageTitle: 'Agregar Facturas'}
        })
        .state('index.branches', {
          url: "/branches",
          templateUrl: "views/branch/branches.html",
          controller: "BranchCtrl",
          controllerAs: "vm",
          data: {pageTitle: 'Sucursales'}
        })
        .state('index.cubicles', {
          url: "/cubicles",
          templateUrl: "views/cubicle/cubicles.html",
          controller: "CubicleCtrl",
          controllerAs: "vm",
          data: {pageTitle: 'Cub\u00EDculos'}
        })
        .state('index.doctors-appt', {
          url: "/doctors-appt/:reload",
          templateUrl: "views/appointment/appointment.html",
          controller: "AppointmentCtrl",
          controllerAs: "vm",
          data: {pageTitle: 'Citas'}
        })
        .state('index.allcubicles', {
          url: "/doctors-global-calendar",
          templateUrl: "views/doctors/global_calendar.html",
          controller: "GlobalCalendarCtrl",
          controllerAs: "vm",
          data: {pageTitle: 'Calendario Global'}
        })
        .state('index.usercubicles', {
          url: "/doctors-user-calendar",
          templateUrl: "views/calendar/user.calendar.html",
          controller: "UserCalendarCtrl",
          controllerAs: "vm",
          data: {pageTitle: 'Calendario de usuario'}
        })
        .state('index.doctors-finances', {
          url: "/doctors-finances",
          templateUrl: "views/doctors/appointment_finances_hist.html",
          controller: "DoctorsApptFinancesCtrl",
          controllerAs: "vm",
          data: {pageTitle: 'Finanzas/Historial'}
        })
        .state('index.doctors-admin-finances', {
          url: "/doctors-admin-finances",
          templateUrl: "views/doctors/appointment_finances_hist.html",
          controller: "DoctorsApptFinancesAdminCtrl",
          controllerAs: "vm",
          data: {pageTitle: 'Finanzas/Historial'}
        })
        .state('index.doctors-store', {
          url: "/doctors-store",
          templateUrl: "views/store/store.html",
          controller: "StoreApptFinancesCtrl",
          controllerAs: "vm",
          data: {pageTitle: 'Tienda'}
        })
        .state('index.payment', {
          url: "/payment",
          templateUrl: "views/store/payment.html",
          controller: "StorePaymentCtrl",
          controllerAs: "vm",
          data: {pageTitle: 'Tienda'}
        })
        .state('index.admin-memberships', {
          url: "/admin-memberships",
          templateUrl: "views/membership/admin-membership.html",
          controller: "AdminMembershipCtrl",
          controllerAs: "vm",
          data: {pageTitle: 'Administraci\u00F3n de membres\u00EDas'}
        })
        .state('index.status', {
          url: "/status",
          templateUrl: "views/status/status.html",
          controller: "StatusCtrl",
          controllerAs: "vm",
          data: {pageTitle: 'Status'}
        })
        .state('index.membership-successconfirmation', {
          url: "/membership-successconfirmation",
          templateUrl: "views/doctors/membership-successconfirmation.html",
          controller: "MemberShipSuccesfullCtrl",
          controllerAs: "vm",
          data: {pageTitle: 'Success Membership'}
        })
        .state('membership-failureconfirmation', {
          url: "/membership-failureconfirmation",
          templateUrl: "views/doctors/membership-failureconfirmation.html",
          controller: "MemberShipFailurefullCtrl",
          controllerAs: "vm",
          data: {pageTitle: 'Failure Membership'}
        })
        .state('index.tutorial_01', {
          url: "/tutorial",
          templateUrl: "views/tutorial/tutorial.html",
          controller: "TutorialCtrl",
          controllerAs: "vm",
          data: {
            pageTitle: 'Agendar Cita',
            videoSrc: 'FPY_aUoIw1w'
          }
        });

    }]);