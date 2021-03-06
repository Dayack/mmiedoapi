// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic','ngLocale', 'app.controllers', 'app.routes', 'app.services', 'app.directives', 'ui.bootstrap.datetimepicker','ionic-datepicker'])
  .config(function($httpProvider,$ionicConfigProvider) {
/**SPecial config to remove the OPTIONS request from the app**/
$httpProvider.defaults.headers.common = {};
    $httpProvider.defaults.headers.post = {};
    $httpProvider.defaults.headers.put = {};
    $httpProvider.defaults.headers.patch = {};
    /***/
    $ionicConfigProvider.views.maxCache(0);


    $httpProvider.interceptors.push(function(){
      return {
        //TESTING FOR GIT
        request: function(req) {
          // transform all request that start with / to the defined url
          if (req.url.charAt(0) ==='/') {
            req.url = 'http://api.mmi-e.com/mmiapi.php' + req.url;
          }
          return req;
        }
      };
    });
  })
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})
;
