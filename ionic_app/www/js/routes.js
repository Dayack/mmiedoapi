angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider


    .state('menu', {
      url: '/side-menu',
      abstract:true,
      templateUrl: 'templates/menu.html',
      controller: 'menuCtrl'
    })




    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'loginCtrl'
    })





    .state('medios', {
      url: '/media',
      templateUrl: 'templates/medios.html',
      controller: 'mediosCtrl'
    })





    .state('menu.categorias', {
      url: '/categories',
      views: {
        'side-menu21': {
          templateUrl: 'templates/categorias.html',
          controller: 'categoriasCtrl'
        }
      }
    })





    .state('menu.noticias', {
      url: '/news',
      views: {
        'side-menu21': {
          templateUrl: 'templates/noticias.html',
          controller: 'noticiasCtrl'
        }
      }
    })





    .state('detalle', {
      url: '/detail',      
        templateUrl: 'templates/detalleDeLaNoticia.html',
        controller: 'detalleCtrl'
    })


    ;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});
