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




    .state('subCategorias', {
      url: '/sub-categories',
      templateUrl: 'templates/sub-categorias.html',
      controller: 'subCategoriasCtrl'
    })





    .state('menu.eventPlace', {
      url: '/eventPlace',
      views: {
        'side-menu21': {
          templateUrl: 'templates/eventPlace.html',
          controller: 'eventPlaceCtrl'
        }
      }
    })





    .state('menu.origin', {
      url: '/origin',
      views: {
        'side-menu21': {
          templateUrl: 'templates/origin.html',
          controller: 'originCtrl'
        }
      }
    })




    .state('menu.noticias', {
      url: '/news/:media',
      views: {
        'side-menu21': {
          templateUrl: 'templates/noticias.html',
          controller: 'noticiasCtrl'
        }
      }
    })




    .state('menu.preview-noticias', {
      url: '/preview',
      views: {
        'side-menu21': {
          templateUrl: 'templates/preview-noticias.html',
          controller: 'previewNoticiasCtrl'
        }
      }
    })




    .state('detalle', {
      url: '/detail/:media/:date/:id/:support',
        templateUrl: 'templates/detalleDeLaNoticia.html',
        controller: 'detalleCtrl'
    })

    .state('date_filter', {
      url: '/date_filter',
        templateUrl: 'templates/selectDate.html',
        controller: 'selectDateCtrl'
    })


    ;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});
