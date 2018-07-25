angular
  .module('aurora')
  .run(['CONSTANTS', '$rootScope', '$state', '$window', '$location', '$sessionStorage', 'DTDefaultOptions',
    function (CONSTANTS, $rootScope, $state, $window, $location, $sessionStorage, DTDefaultOptions) {

      $rootScope.$state = $state;

      // $rootScope.$on('event:auth-login-required', function() {
      //   authService.refresh().then(null, function() {  });
      // });

      var monthsShortDot = 'ene._feb._mar._abr._may._jun._jul._ago._sep._oct._nov._dic.'.split('_'),
        monthsShort = 'ene_feb_mar_abr_may_jun_jul_ago_sep_oct_nov_dic'.split('_');

      moment.locale('es', {
        months : 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
        monthsShort : function (m, format) {
          if (/-MMM-/.test(format)) {
            return monthsShort[m.month()];
          } else {
            return monthsShortDot[m.month()];
          }
        },
        weekdays : 'Domingo_Lunes_Martes_Mi\u00E9rcoles_Jueves_Viernes_S\u00E1bado'.split('_'),
        weekdaysShort : 'Dom._Lun._Mar._Mi\u00E9._Jue._Vie._S\u00E1b.'.split('_'),
        weekdaysMin : 'Do_Lu_Ma_Mi_Ju_Vi_S\u00E1'.split('_'),
        longDateFormat : {
          LT : 'H:mm',
          LTS : 'H:mm:ss',
          L : 'DD/MM/YYYY',
          LL : 'D [de] MMMM [de] YYYY',
          LLL : 'D [de] MMMM [de] YYYY H:mm',
          LLLL : 'dddd, D [de] MMMM [de] YYYY H:mm'
        },
        calendar : {
          sameDay : function () {
            return '[hoy a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
          },
          nextDay : function () {
            return '[ma\u00F1ana a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
          },
          nextWeek : function () {
            return 'dddd [a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
          },
          lastDay : function () {
            return '[ayer a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
          },
          lastWeek : function () {
            return '[el] dddd [pasado a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
          },
          sameElse : 'L'
        },
        relativeTime : {
          future : 'en %s',
          past : 'hace %s',
          s : 'unos segundos',
          m : 'un minuto',
          mm : '%d minutos',
          h : 'una hora',
          hh : '%d horas',
          d : 'un d\u00EDa',
          dd : '%d d\u00EDas',
          M : 'un mes',
          MM : '%d meses',
          y : 'un a\u00F1o',
          yy : '%d a\u00F1os'
        },
        ordinalParse : /\d{1,2}º/,
        ordinal : '%dº',
        week : {
          dow : 1, // Monday is the first day of the week.
          doy : 4  // The week that contains Jan 4th is the first week of the year.
        }
      });

      angular.forEach(CONSTANTS.API_URIS, function(uri){
        if($location.host().indexOf(uri.key) != -1){
          CONSTANTS.ENV = uri.env;
          CONSTANTS.API_URI = uri.back;
          CONSTANTS.API_URI_UI = uri.ui;
          CONSTANTS.API_URI_OAUTH = uri.oauth;
          CONSTANTS.REST_IN_INDEX = uri.restInIndex;
          CONSTANTS.PAYPAL = uri.PAYPAL;
          CONSTANTS.CONEKTA = uri.CONEKTA;
        }
      });
      if(!CONSTANTS.API_URI){
        CONSTANTS.ENV = CONSTANTS.API_URIS[0].env;
        CONSTANTS.API_URI = CONSTANTS.API_URIS[0].back;
        CONSTANTS.API_URI_UI = CONSTANTS.API_URIS[0].ui;
        CONSTANTS.API_URI_OAUTH = CONSTANTS.API_URIS[0].oauth;
        CONSTANTS.REST_IN_INDEX = CONSTANTS.API_URIS[0].restInIndex;
        CONSTANTS.PAYPAL = CONSTANTS.API_URIS[0].PAYPAL;
        CONSTANTS.CONEKTA = CONSTANTS.API_URIS[0].CONEKTA;
      }

      $rootScope.CONSTANTS = CONSTANTS;

      $rootScope.$on('$stateChangeStart',
        function (event, toState) {
          if(!$sessionStorage.userToken) {
            delete $sessionStorage.userToken;
            if (toState.url !== '/login' && toState.url !== '/reset/:id/:key' && toState.url !== '/cancelapt/:apt/:cancelKey') {
              event.preventDefault();
              $state.go('login');
            }
          }
        });

      DTDefaultOptions.setLanguageSource('resources/Spanish.json');

  }]);