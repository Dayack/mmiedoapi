angular.module('app.controllers', [])


/**
 * Side menu Controller
 */
.controller('menuCtrl', function($scope,$rootScope,UserService,FilterService,$state,$ionicHistory) {

    $scope.mediaFilterCollapsed = false;

    $scope.toggleMediaFilter = function() {
      $scope.mediaFilterCollapsed = !$scope.mediaFilterCollapsed;
    };

    $scope.selectMedia = function(media) {
      FilterService.setMedia(media);
    };

    //logout button in side menu
    $scope.logout = function() {
      UserService.logout()
      $state.go('login');
      $ionicHistory.clearHistory();
    };

})


/**
 * Login View Controller
 */
.controller('loginCtrl', function($scope,UserService,$state) {
    $scope.user = {username : '',
    password : ''};
    $scope.successfulLogin = null; //will be set to TRUE or FALSE after the login request
    //depending on the result of the API call
    $scope.login = function() {
      UserService.login($scope.user.username,$scope.user.password).then(function(data) {
        if (data ==='OK') {
          $scope.successfulLogin = true;
          $state.go('menu.categorias');
        } else {
          $scope.successfulLogin = false;
        }

      });
    };

})

.controller('mediosCtrl', function($scope) {

})

.controller('categoriasCtrl', function($scope,UserService,CategoryService,$state,UserService) {
    $scope.user = UserService.getUser();
    //$scope.categories = [{"IDCATEGORIA": "2", "NOMBRE": "Categoria 1"},{"IDCATEGORIA": "3", "NOMBRE": "Categoria 2"}];
    //$scope.categories = CategoryService.getCategories($scope.user);
    $scope.categories = CategoryService.getCategories($scope.user).then(function(data) {
      $scope.categories = data;
    });

    $scope.selectCategory= function(category){
      CategoryService.setCurrentCategory(category);
     // $state.go('menu.noticias');
      $state.go('menu.noticias');
    };

})

.controller('selectDateCtrl', function($scope) {
    $scope.datepickerObject = {
      dateFormat: 'dd-MM-yyyy',
      callback: function(val) 	{
        //alert(JSON.stringify(val));
        $scope.datepickerObject.inputDate = val;
      }

    };

})

.controller('noticiasCtrl', function($scope,$ionicNavBarDelegate,FilterService,UserService,HttpService,$state) {
    $ionicNavBarDelegate.showBackButton(false);//disable the back button
    $scope.news = [];
    $scope.currentPage = 0;
    $scope.user = UserService.getUser();
    //the currentPage must be reset to 0 when a new filter is applied, TODO
    $scope.filters = FilterService.getFilters();
    HttpService.getNews($scope.user,$scope.filters).then(function(data) {
      $scope.news = data;
    });
    $scope.goToNew =function(detailNew){

      $state.go('detalle');
    };
})

.controller('detalleCtrl', function($scope,UserService,CategoryService,$state,UserService,$ionicNavBarDelegate) {
    $ionicNavBarDelegate.showBackButton(true);//disable the back button

    $scope.user = UserService.getUser();
    //$scope.categories = [{"IDCATEGORIA": "2", "NOMBRE": "Categoria 1"},{"IDCATEGORIA": "3", "NOMBRE": "Categoria 2"}];
    //$scope.categories = CategoryService.getCategories($scope.user);
    $scope.categories = CategoryService.getCategories($scope.user).then(function(data) {
      $scope.categories = data;
    });

    $scope.selectCategory= function(category){
      CategoryService.setCurrentCategory(category);
     // $state.go('menu.noticias');
      $state.go('menu.detalle');
    };
})
;
