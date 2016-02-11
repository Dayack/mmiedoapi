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
.controller('loginCtrl', function($scope,UserService,$state,CategoryService) {
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

    //Autologin
    if (UserService.autoLogin()) {
      $scope.successfulLogin = true;
        if (CategoryService.loadStatus()) {
          //info found in the localStorate, exit from this view and go direct to news
          $state.go('menu.preview-noticias');
        } else {
          $state.go('menu.categorias');
        }
    }

})

.controller('mediosCtrl', function($scope,FilterService,$state,$rootScope) {
    $scope.selectMedia = function(media) {
      FilterService.setMedia(media);
      $rootScope.$broadcast('filtersChanged');
      $state.go('menu.noticias');
    };

})

.controller('categoriasCtrl', function($scope,UserService,CategoryService,$state,$ionicLoading,$rootScope,$stateParams) {

    $scope.user = UserService.getUser();
    //only if come from Login, and there is previous info about categories (selected), just obviate this page, and jump to preview-nes
    $scope.allSelected={value:true};//all options selected?
    $ionicLoading.show({
      template: '<div class="icon ion-loading-c loading-color">'
    });



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
      $rootScope.$broadcast('reload-block');
      $state.go('menu.preview-noticias');

    };

    $scope.categories = CategoryService.getCategories($scope.user).then(function(data) {
      $scope.categories = data;
      $scope.allSelected.value = CategoryService.isAllSelected();
      //If is the first time loaded and there is not selectedCategories or allSelected = true, autoselect all
      if (!CategoryService.areSelectedCategories()) {
        $scope.selectAll();
      }


      $ionicLoading.hide();
    });

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

  .controller('previewNoticiasCtrl', function($scope,$ionicNavBarDelegate,FilterService,UserService,NewsService,$state,$ionicLoading,$rootScope) {
  $scope.blockNews= [
    {news:[], type:"TV"},
    {news:[], type:"RADIO"},
    {news:[], type:"PRESS"},
    {news:[], type:"SOCIAL"},
    {news:[], type:"INTERNET"},
    {news:[], type:"TWITTER"}

  ];
    $ionicNavBarDelegate.showBackButton(false);//disable the back button
    $scope.loadedComplete= false;
    //Start loading
    $scope.loadBlocks = function() {
      $ionicLoading.show({
        template: '<div class="icon ion-loading-c loading-color">'
      });
      $scope.blocksLoaded = 0;//to keep the count of the blocks loaded
      $scope.filters = FilterService.getFilters();
      $scope.options = null;
      //load different MEDIAS
      NewsService.getNews($scope.user, "TV", $scope.filters, $scope.options, 5, 0).then(function (data) {
        for (var i = 0; i < $scope.blockNews.length; i++) {
          if ($scope.blockNews[i].type === data.type) {
            $scope.blockNews[i].news = data.news;
            $scope.blocksLoaded++;
          }
        }

      });

      //RADIO
      NewsService.getNews($scope.user, "RADIO", $scope.filters, $scope.options, 5, 0).then(function (data) {
        for (var i = 0; i < $scope.blockNews.length; i++) {
          if ($scope.blockNews[i].type === data.type) {
            $scope.blockNews[i].news = data.news;
            $scope.blocksLoaded++;
          }
        }

      });
      //PRESS
      NewsService.getNews($scope.user, "PRESS", $scope.filters, $scope.options, 5, 0).then(function (data) {
        for (var i = 0; i < $scope.blockNews.length; i++) {
          if ($scope.blockNews[i].type === data.type) {
            $scope.blockNews[i].news = data.news;
            $scope.blocksLoaded++;
          }
        }

      });
      //SOCIAL
      NewsService.getNews($scope.user, "SOCIAL", $scope.filters, $scope.options, 5, 0).then(function (data) {
        for (var i = 0; i < $scope.blockNews.length; i++) {
          if ($scope.blockNews[i].type === data.type) {
            $scope.blockNews[i].news = data.news;
            $scope.blocksLoaded++;
          }
        }

      });
      //INTERNET
      NewsService.getNews($scope.user, "INTERNET", $scope.filters, $scope.options, 5, 0).then(function (data) {
        for (var i = 0; i < $scope.blockNews.length; i++) {
          if ($scope.blockNews[i].type === data.type) {
            $scope.blockNews[i].news = data.news;
            $scope.blocksLoaded++;
          }
        }

      });
      //TWITTER
      NewsService.getNews($scope.user, "TWITTER", $scope.filters, $scope.options, 5, 0).then(function (data) {
        for (var i = 0; i < $scope.blockNews.length; i++) {
          if ($scope.blockNews[i].type === data.type) {
            $scope.blockNews[i].news = data.news;
            $scope.blocksLoaded++;
          }
        }

      });
    };

    //this code is executed every time that state.go is invoked
   $scope.$on('$ionicView.afterEnter',
      function() {
        $ionicNavBarDelegate.showBackButton(false);//disable the back button
        // Code here is always executed when entering this state
       // $ionicNavBarDelegate.showBar(true); //if this code is not set, the top bar will desapear
        $scope.loadBlocks();
      }
    );
    //*/
    $scope.$on('reload-block',function(){
      $scope.loadBlocks();
    });
    //disable loading mask when all blocks are loaded
    $scope.$watch('blocksLoaded',function(){
      if ($scope.blocksLoaded == $scope.blockNews.length) {
        $ionicLoading.hide();
        $scope.loadedComplete= true;
      }
    });

    $scope.goToNews=function(media){
      FilterService.setMedia(media);
      $state.go('menu.noticias');
    };


  })
    .controller('noticiasCtrl', function($scope,$ionicNavBarDelegate,FilterService,UserService,NewsService,$state,$ionicLoading,$rootScope) {

    $rootScope.activeFilters = {value: true};
    $scope.noMoreItemsAvailable = false;

    $ionicLoading.show({
      template: '<div class="icon ion-loading-c loading-color">'
    });
    $scope.offset=0;
    $scope.limit=10;
    $ionicNavBarDelegate.showBackButton(false);//disable the back button
    $scope.news = [];
    $scope.user = UserService.getUser();
    $scope.filters = FilterService.getFilters();
    $scope.media = $scope.filters.media;
    $scope.loadedComplete = false;//just to check when data is loaded first time;

    NewsService.getNews($scope.user,$scope.filters.media,$scope.filters,null,$scope.limit,$scope.offset).then(function(data) {
         $ionicLoading.hide();
      $scope.news = $scope.news.concat(data.news.slice());
      $scope.loadedComplete= true;
      if (data.news.length ===0) {
        $scope.noMoreItemsAvailable=true;
      }
   });
    $scope.goToPreview=function(){
      $state.go('menu.preview-noticias');
    };
    $scope.loadMore = function() {
      var options = {infiniteScroll: true};
      $scope.offset += $scope.limit;
      NewsService.getNews($scope.user,$scope.filters.media,$scope.filters,options,$scope.limit,$scope.offset).then(function(data) {
        $scope.news = $scope.news.concat(data.news.slice());
        $scope.loadedComplete= true;
        if (data.news.length ===0) {
          $scope.noMoreItemsAvailable=true;
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
      });
    };

    $scope.$on('filtersChanged', function() {
      $scope.filters = FilterService.getFilters();
      $ionicLoading.show({
        template: '<div class="icon ion-loading-c loading-color">'
      });
      NewsService.getNews($scope.user,$scope.filters.media,$scope.filters,null,null,null).then(function(data) {
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
