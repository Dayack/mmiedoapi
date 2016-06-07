// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic','ngCordova','ngLocale', 'app.controllers', 'app.routes', 'app.services', 'app.directives', 'ui.bootstrap.datetimepicker','ionic-datepicker','ionic-audio','ngPDFViewer'])
  .config(function($httpProvider,$ionicConfigProvider) {
/**SPecial config to remove the OPTIONS request from the app**/
$httpProvider.defaults.headers.common = {};
    $httpProvider.defaults.headers.post = {};
    $httpProvider.defaults.headers.put = {};
    $httpProvider.defaults.headers.patch = {};
    /***/
   // $ionicConfigProvider.views.maxCache(0); --cache views, now each view has its own cachessytem
    $httpProvider.interceptors.push('timeoutHttpIntercept');//add timeout to requests, check services.js


    $httpProvider.interceptors.push(function(){
      return {
        //TESTING FOR GIT
        request: function(req) {
          // transform all request that start with / to the defined url
          if (angular.isString(req.url) && req.url.charAt(0) ==='/') {
            req.url = 'http://api.mmi-e.com/mmiapi.php' + req.url;
          }
          return req;
        }
      };
    });
  })
.run(function($ionicPlatform,$rootScope,$state) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    $rootScope.actualState="";


    $rootScope.$on('$stateChangeStart', function (event, toState, toStateParams, fromState, fromStateParams) {

      console.log("Changing state to :");
      console.log(toState.name);
      $rootScope.fromState=fromState;
      $rootScope.actualState=toState.name;
      $rootScope.currentState = toState;

    });

    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();

    }
  });
    $rootScope.activeFilters= {value:false};
  })
;
