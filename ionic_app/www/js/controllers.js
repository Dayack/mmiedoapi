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

.controller('mediosCtrl', function($scope,FilterService,$state,$rootScope) {
    $scope.selectMedia = function(media) {
      FilterService.setMedia(media);
      $rootScope.$broadcast('filtersChanged');
      $state.go('menu.noticias');
    };

})

.controller('categoriasCtrl', function($scope,UserService,CategoryService,$state,$ionicLoading) {

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
    };
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
    };
    $scope.goToNews= function() {
      $state.go('menu.categorias');
    };
})

.controller('eventPlaceCtrl', function($scope, UserService, PlacesService, $state) {
	$scope.allSelected={value:false};
    $scope.user = UserService.getUser();
    $scope.places = PlacesService.getPlaces($scope.user).then(function(data) {
      $scope.places = data;
    });
    $scope.selectAll=function() {
      $scope.allSelected={value:true};
      PlacesService.selectAll();
    };
    $scope.selectPlace=function(place) {
      $scope.allSelected={value:false};
      PlacesService.selectPlace(place);
      
    };
    $scope.goToNews= function() {
      $state.go('menu.noticias');
    };

})

.controller('selectDateCtrl', function($scope,$state,FilterService,$rootScope,$ionicHistory) {
    $rootScope.showBack=true;
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

.controller('noticiasCtrl', function($scope,$ionicNavBarDelegate,FilterService,UserService,NewsService,$state,$ionicLoading,$rootScope) {
    
    $rootScope.activeFilters = {value: true};

    $ionicLoading.show({
      template: '<div class="icon ion-loading-c loading-color">'
    });

    window.setTimeout(function() {
	  $ionicLoading.hide();
    }, 3000);    

    $ionicNavBarDelegate.showBackButton(false);//disable the back button
    $scope.news = [];
    $scope.user = UserService.getUser();
    $scope.filters = FilterService.getFilters();

    NewsService.getNews($scope.user,$scope.filters).then(function(data) {
      $scope.news = data;
      $ionicLoading.hide();
    });

    $scope.loadMore = function() {
      //$ionicLoading.show({
      //  template: '<div class="icon ion-loading-c loading-color">'
      //});
      var options = {infiniteScroll: true};
      NewsService.getNews($scope.user,$scope.filters, options).then(function(data) {
        $scope.news = data;
        //window.setTimeout(function() {
	//  $ionicLoading.hide();
        //}, 1000);    
	//$ionicLoading.hide();
        $scope.$broadcast('scroll.infiniteScrollComplete');
      });
    };

    $scope.$on('filtersChanged', function() {
      $scope.filters = FilterService.getFilters();
      $ionicLoading.show({
        template: '<div class="icon ion-loading-c loading-color">'
      });
      NewsService.getNews($scope.user,$scope.filters).then(function(data) {
        $scope.news = data;
        window.setTimeout(function() {
	  $ionicLoading.hide();
        }, 3000);    
	//$ionicLoading.hide();
      });
    });

    $scope.goToNew =function(detailNew){
      //$state.go('detalle');
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
