// /*global angular:true, browser:true */
//
// (function () {
//   'use strict';
//
//   angular.module('oauth2-service', ['base64'])
//     .provider('authService', function () {
//       return {
//         $get: ['CONSTANTS', '$http', '$q', '$log', 'base64', 'authInterceptor', '$sessionStorage',
//           function (CONSTANTS, $http, $q, $log, base64, authInterceptor, $sessionStorage) {
//
//             var tokenBusy = false;
//             var clientCredentials = base64.encode(CONSTANTS.OAUTH.clientId + ':' + CONSTANTS.OAUTH.secret);
//
//             return {
//               login: function (username, password) {
//                 delete $sessionStorage.token;
//                 var deferred = $q.defer();
//                 $http.post(CONSTANTS.API_URI_OAUTH, null, {
//                   params: {'username': username, 'password': password, 'grant_type': "password"},
//                   headers: {'Authorization': "Basic " + clientCredentials},
//                   ignoreAuthModule: true
//                 }).success(function (data) {
//                   $sessionStorage.token = data.access_token;
//                   $sessionStorage.refreshToken = data.refresh_token;
//                   // console.log('token 1: ' + $sessionStorage.token);
//                   // console.log('refreshToken 1: ' + $sessionStorage.refreshToken);
//                   deferred.resolve();
//                 }).error(deferred.reject);
//                 return deferred.promise;
//               },
//               refresh: function () {
//                 // console.log('token 2: ' + $sessionStorage.token);
//                 // console.log('refreshToken 2: ' + $sessionStorage.refreshToken);
//                 var deferred = $q.defer();
//                 if (!$sessionStorage.refreshToken) {
//                   // $log.debug("token refresh unavailable");
//                   deferred.reject();
//                 } else if (tokenBusy) {
//                   // $log.debug("token refresh already in progress");
//                   deferred.resolve();
//                 } else {
//                   // $log.debug("refreshing token");
//                   tokenBusy = true;
//                   $http.post(CONSTANTS.API_URI_OAUTH, null, {
//                     params: {'grant_type': "refresh_token", 'refresh_token': $sessionStorage.refreshToken},
//                     headers: {'Authorization': "Basic " + clientCredentials},
//                     ignoreAuthModule: true
//                   }).success(function (data) {
//                     tokenBusy = false;
//                     $sessionStorage.token = data.access_token;
//                     $sessionStorage.refreshToken = data.refresh_token;
//                     // $log.debug("new token:" + $sessionStorage.token);
//                     // $log.debug("new refreshToken:" + $sessionStorage.refreshToken);
//                     authInterceptor.loginConfirmed();
//                     deferred.resolve();
//                   }).error(function () {
//                     tokenBusy = false;
//                     // console.log('error');
//                     deferred.reject();
//                   });
//                 }
//                 return deferred.promise;
//               }
//             }
//           }]
//       }
//     })
// })();