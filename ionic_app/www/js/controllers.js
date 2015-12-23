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
      $state.go('subCategorias');
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
    $scope.subCategories = function() {
      return CategoryService.getSubCategories();
    };
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

.controller('originCtrl', function($scope, UserService, OriginService, $state) {
    $scope.allSelected={value:false};
    $scope.user = UserService.getUser();
    $scope.origins = OriginService.getOrigins($scope.user).then(function(data) {
      $scope.origins = data;
    });
    $scope.selectAll=function() {
      $scope.allSelected={value:true};
      OriginService.selectAll();
    };
    $scope.selectOrigin=function(origin) {
      $scope.allSelected={value:false};
      OriginService.selectOrigin(origin);

    };
    $scope.goToNews= function() {
      $state.go('menu.noticias');
    };

})


.controller('selectDateCtrl', function($scope,$state,FilterService,$rootScope,$ionicHistory) {

    //load from service
    $scope.data = {
      fromDate: new Date(),
      toDate: new Date()
    };
    $scope.showFrom = {value:null};
    $scope.showTo = {value:false};

    $scope.selectTime = function(time) {
      switch (time) {
        case 'Today':
          $scope.data.toDate = new Date();
          $scope.data.fromDate = new Date();
          $scope.data.fromDate= new Date($scope.data.fromDate.setHours(0));
          $scope.data.fromDate= new Date($scope.data.fromDate.setMinutes(0));
          $scope.data.fromDate= new Date($scope.data.fromDate.setSeconds(0));
          $scope.data.fromDate= new Date($scope.data.fromDate.setMilliseconds(0));
              break;
        case 'yesterday':
          $scope.data.toDate = new Date();
          $scope.data.toDate = new Date($scope.data.toDate.setHours(0));
          $scope.data.toDate = new Date($scope.data.toDate.setMinutes(0));
          $scope.data.toDate = new Date($scope.data.toDate.setSeconds(0));
          $scope.data.toDate = new Date($scope.data.toDate.setMilliseconds(0));
          $scope.data.fromDate = new Date();
          $scope.data.fromDate.setDate($scope.data.toDate.getDate() - 1);
          $scope.data.toDate.setDate($scope.data.fromDate.getDate());
          break;
        case '7d':
          $scope.data.toDate = new Date();
          $scope.data.toDate=new Date($scope.data.toDate.setHours(0));
          $scope.data.toDate=new Date($scope.data.toDate.setMinutes(0));
          $scope.data.toDate=new Date($scope.data.toDate.setSeconds(0));
          $scope.data.toDate=new Date($scope.data.toDate.setMilliseconds(0));
          $scope.data.fromDate = new Date();
          $scope.data.fromDate.setDate($scope.data.toDate.getDate() - 7);
          break;
        case '30d':
          $scope.data.toDate = new Date();
          $scope.data.toDate=new Date($scope.data.toDate);
          $scope.data.toDate=new Date($scope.data.toDate.setHours(0));
          $scope.data.toDate=new Date($scope.data.toDate.setMinutes(0));
          $scope.data.toDate=new Date($scope.data.toDate.setSeconds(0));
          $scope.data.toDate=new Date($scope.data.toDate.setMilliseconds(0));
          $scope.data.fromDate = new Date();
          $scope.data.fromDate.setDate($scope.data.toDate.getDate() - 30);
          break;

      }
    };

    $scope.$watch('data.fromDate', function() {
       if ($scope.showFrom.value===null) {
         $scope.showFrom.value=true;
         $scope.showTo.value=false;
       } else {
         $scope.showFrom.value=false;
         $scope.showTo.value=true;
       }
    });
    
    $scope.$watch('data.toDate', function() {
       if ($scope.showTo.value===true) {
         $scope.showTo.value=false;
         $scope.showFrom.value=true;
         $state.go('menu.noticias');
       }
    });

    $scope.deployCalendar = function(datepicker) {
      switch (datepicker) {
        case 'from':
          $scope.showFrom.value=true;
          $scope.showTo.value=false;
              break;
        case 'to':

          $scope.showTo.value=true;
          $scope.showFrom.value=false;
              break;
      }

    };

    //---
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
    }, 12000);    

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
