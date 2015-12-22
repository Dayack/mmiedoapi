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
      $rootScope.$broadcast('filtersChanged');
    };

    //logout button in side menu
    $scope.logout = function() {
      UserService.logout();
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

.controller('categoriasCtrl', function($scope,UserService,CategoryService,$state) {
    $scope.user = UserService.getUser();
    $scope.categories = CategoryService.getCategories($scope.user).then(function(data) {
      $scope.categories = data;
    });
    $scope.allSelected={value:false};//all options selected?

    $scope.selectCategory= function(category){
      $scope.allSelected.value=false;
      CategoryService.setSelectedCategory(category);
      $state.go('menu.subCategorias');
    };

    $scope.selectAll=function(){
      $scope.allSelected.value=true;
      CategoryService.deselectAllCategories();
    }
    $scope.goToNews= function() {
      $state.go('menu.noticias');
    };

})

.controller('subCategoriasCtrl', function($scope, UserService,CategoryService,$state) {
    $scope.user = UserService.getUser();
    $scope.subCategories = CategoryService.getSubCategories();
    $scope.selectedCategoryTitle = CategoryService.getSelectedCategoryNombre();
    $scope.selectedSubCategories = function(subCategory){
      CategoryService.selectSubCategory(subCategory);
    }
})

.controller('selectDateCtrl', function($scope,$state,FilterService) {
    $scope.fromDatepickerObject = {
      dateFormat: 'dd-MM-yyyy',
      monthList: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
      callback: function(val) 	{
        $scope.fromDatepickerObject.inputDate = val;
      }
    };

    $scope.toDatepickerObject = {
      dateFormat: 'dd-MM-yyyy',
      monthList: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
      callback: function(val) 	{
        $scope.toDatepickerObject.inputDate = val;
      }
    };

    $scope.goToNews= function() {
      $state.go('menu.noticias');
    };
})

.controller('noticiasCtrl', function($scope,$ionicNavBarDelegate,FilterService,UserService,NewsService,$state) {
    $ionicNavBarDelegate.showBackButton(false);//disable the back button
    $scope.news = [];
    $scope.user = UserService.getUser();
    $scope.filters = FilterService.getFilters();

    NewsService.getNews($scope.user,$scope.filters).then(function(data) {
      $scope.news = data;
    });

    $scope.loadMore = function() {
      var options = {infiniteScroll: true};
      NewsService.getNews($scope.user,$scope.filters, options).then(function(data) {
        $scope.news = data;
        $scope.$broadcast('scroll.infiniteScrollComplete');
      });
    };

    $scope.$on('filtersChanged', function() {
      $scope.filters = FilterService.getFilters();
      NewsService.getNews($scope.user,$scope.filters).then(function(data) {
        $scope.news = data;
      });
    });

    $scope.goToNew =function(detailNew){
      $state.go('detalle');
    };
})

.controller('detalleCtrl', function($scope,UserService,CategoryService,$state,$ionicNavBarDelegate) {
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
