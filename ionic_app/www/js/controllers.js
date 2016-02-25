angular.module('app.controllers', [])


/**
 * Side menu Controller
 */
.controller('menuCtrl', function($ionicSideMenuDelegate,$scope,$rootScope,UserService,FilterService,$state,$ionicHistory,CategoryService) {

    $scope.mediaFilterCollapsed = false;

    $scope.toggleMediaFilter = function() {
      $scope.mediaFilterCollapsed = !$scope.mediaFilterCollapsed;
    };

    $scope.selectMedia = function(media) {
      if (media ==="ALL") {
        $state.go('menu.preview-noticias');
      } else {
        FilterService.setMedia(media);
        //$rootScope.$broadcast('filtersChanged');
      }
    };

    $scope.goToPage=function(state) {
      console.log("actual state "+$state.current.name);
      console.log("go to "+state);
      if (angular.equals(state,$state.current.name)) {
       console.log("closing menu");
        $ionicSideMenuDelegate.toggleLeft();

      } else {
        console.log("moving");
        $state.go(state);
      }
    };

    //logout button in side menu
    $scope.logout = function() {
      UserService.logout();
      CategoryService.clearStatus();
      $ionicHistory.clearHistory();
      $scope.$broadcast('filtersChanged');
      $state.go('login');
    };

    $scope.$on('filtersChanged',function(){
     $rootScope.activeFilters.value = FilterService.getFiltered();
    });

})


/**
 * Login View Controller
 */
.controller('loginCtrl', function($scope,UserService,$state,CategoryService,$ionicHistory) {
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
          $ionicHistory.clearCache().then(function() {
            $state.go('menu.preview-noticias');
          });
        } else {
          $state.go('menu.categorias');
        }
    }

})

.controller('mediosCtrl', function($scope,FilterService,$state,$rootScope,$ionicHistory) {
    $scope.selectMedia = function(media) {
      if (media ==="ALL") {
        $ionicHistory.clearCache().then(function() {
          $state.go('menu.preview-noticias');
        });
      } else {
        FilterService.setMedia(media);
        //$rootScope.$broadcast('filtersChanged');
        $ionicHistory.clearCache().then(function() {
          $state.go('menu.noticias', {media: media, pag: 0, cache: false});
        });
      }
    };

})

.controller('categoriasCtrl', function($scope,UserService,CategoryService,$state,$ionicLoading,$rootScope,$stateParams,$ionicHistory, PreviewCacheService) {

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

      PreviewCacheService.clearCachedBlocks();
      $ionicHistory.clearCache().then(function() {
        $state.go('menu.preview-noticias');
      });

    };

    $scope.categories = CategoryService.getCategories($scope.user).then(function(data) {
      $scope.categories = data;
      $ionicLoading.hide();
      $scope.allSelected.value = CategoryService.isAllSelected();
      //If is the first time loaded and there is not selectedCategories or allSelected = true, autoselect all
      if (!CategoryService.areSelectedCategories()) {
        $scope.selectAll();
      }



    });

})

.controller('subCategoriasCtrl', function($scope, UserService,CategoryService,$state,$ionicHistory) {
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

.controller('eventPlaceCtrl', function($ionicHistory,$scope, UserService, PlacesService, $state,FilterService,$rootScope) {
	$scope.allSelected={value:PlacesService.areAllSelected()};//all is by defect
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
      FilterService.setFilterByPlace(!$scope.allSelected.value);
      $rootScope.$broadcast('filtersChanged');
      $ionicHistory.clearCache().then(function() {
        $state.go('menu.preview-noticias');
      });
    };

})

.controller('originCtrl', function($ionicHistory,$scope, UserService, OriginService, $state,FilterService,$rootScope) {
    $scope.allSelected={value:OriginService.areAllSelected()};
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
      FilterService.setFilterByOrigin(!$scope.allSelected.value);
      $rootScope.$broadcast('filtersChanged');

      $ionicHistory.clearCache().then(function() {
        $state.go('menu.preview-noticias');
      });
    };

})


.controller('selectDateCtrl', function(PreviewCacheService,$ionicHistory,$scope,$state,FilterService,$rootScope,$ionicHistory,DateHelperService) {
    $scope.defaultDates= null;//if set false, is to activate filters, if false, are default dates the disable filters icon
    // , if null, the data has not been changed in the top options (today,yesterday..) so is changed in the datepicker
    //load from service
    $scope.data = {
      fromDate: new Date(),
      toDate: new Date()
    };
    $scope.showFrom = {value:null};
    $scope.showTo = {value:false};

    //save the dates in the filter service and exit to the news blocks
    $scope.saveAndExit=function(){
      FilterService.setFromDate($scope.data.fromDate);
      FilterService.setToDate($scope.data.toDate);
      $rootScope.$broadcast('filtersChanged');
      PreviewCacheService.clearCachedBlocks();
      $ionicHistory.clearCache().then(function() {
        $state.go('menu.preview-noticias');
      });
    };


    $scope.selectTime = function(time) {
      switch (time) {
        case 'Today':
          $scope.data.toDate = DateHelperService.getToday();
          $scope.data.fromDate = DateHelperService.getToday();
          $scope.defaultDates=false;
              break;
        case 'yesterday':
          $scope.data.toDate =  DateHelperService.getToday();
          $scope.data.toDate = DateHelperService.addDays($scope.data.toDate,-1);
          $scope.data.fromDate = DateHelperService.addDays($scope.data.toDate,0);
          $rootScope.activeFilters.value=true;
          $scope.defaultDates=false;
          break;
        case '7d':
          $scope.data.toDate = DateHelperService.getToday();
          $scope.data.fromDate = DateHelperService.addDays($scope.data.toDate,-7);
          $rootScope.activeFilters.value=true;
          $scope.defaultDates=false;
          break;
        case '30d':
          $scope.data.toDate = DateHelperService.getToday();
          $scope.data.fromDate = DateHelperService.addDays($scope.data.toDate,-30);
          $rootScope.activeFilters.value=true;
          $scope.defaultDates=false;
          break;
        case '5y':
          $scope.data.toDate = DateHelperService.getToday();
          $scope.data.fromDate = DateHelperService.addDays($scope.data.toDate,-1865);

          $rootScope.activeFilters.value=false;
          $scope.defaultDates=true;

      }
      $scope.saveAndExit();
    };

    $scope.$watch('data.fromDate', function() {
       if ($scope.showFrom.value===null) {
         $scope.showFrom.value=true;
         $scope.showTo.value=false;
       } else {
         $scope.showFrom.value=false;
         $scope.showTo.value=true;
       }
      if ($scope.defaultDates === null) {
        $scope.defaultDates=false;
      }
      FilterService.setFilterByDate(!$scope.defaultDates);
    });

    $scope.$watch('data.toDate', function() {
       if ($scope.showTo.value===true) {
         $scope.showTo.value=false;
         $scope.showFrom.value=true;
         if ($scope.defaultDates === null) {
           $scope.defaultDates=false;
         }
         FilterService.setFilterByDate(!$scope.defaultDates);
         $scope.saveAndExit();
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
})

  .controller('previewNoticiasCtrl', function(PreviewCacheService,ConfigService,$timeout,$ionicHistory,$window,ScrollService,$location,$scope,$ionicNavBarDelegate,FilterService,UserService,NewsService,$state,$ionicLoading,$rootScope) {
  $scope.blockNews= [
    {news:[],ids:[], type:"TV"},
    {news:[],ids:[], type:"RADIO"},
    {news:[],ids:[], type:"PRESS"},
    {news:[],ids:[], type:"INTERNET"},
    {news:[],ids:[], type:"SOCIAL"},
    {news:[],ids:[], type:"TWITTER"}

  ];
    $ionicNavBarDelegate.showBackButton(false);//disable the back button
    $scope.loadedComplete= false;
    //Start loading
    $scope.loadBlocks = function() {
      $ionicLoading.show({
        template: '<div class="icon ion-loading-c loading-color">'
      });
      console.log("loading mask");

      //check if the previewData is loaded previously
      $scope.cachedBlocks=PreviewCacheService.getCachedBlocks();
      if ($scope.cachedBlocks !==null){
        $scope.blockNews = $scope.cachedBlocks;
        $ionicLoading.hide();
        $scope.loadedComplete= true;
        console.log("hide by cache");
      } else {
        console.log("no cached");

        $timeout(function () {
          $ionicLoading.hide();
          console.log("loading mask HIDE by timeout");
        }, 10000);
        $scope.blocksLoaded = 0;//to keep the count of the blocks loaded
        $scope.filters = FilterService.getFilters();
        $scope.options = null;
        //load different MEDIAS
        NewsService.getNews($scope.user, "TV", $scope.filters, $scope.options, 5, 0).then(function (data) {
          for (var i = 0; i < $scope.blockNews.length; i++) {
            if ($scope.blockNews[i].type === data.type) {
              $scope.blockNews[i].news = data.news;
              angular.forEach($scope.blockNews[i].news, function (value) {
                //value.THUMB1="accesothumb_pub.php?ano=2015&mes=12&zona_id=1&fichero=201512042515_thumb1.jpg";//TEST
                if (angular.isDefined(value.THUMB1) && value.THUMB1 !== "") {
                  value.THUMB1 = ConfigService.getMediaUrl() + value.THUMB1;
                }
              });
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
      }
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
        console.log("hide mask by load");
        $scope.loadedComplete= true;
        PreviewCacheService.setCachedBlocks($scope.blockNews);
      }
    });

    $scope.goToNews=function(media){
      FilterService.setMedia(media);
      $ionicHistory.clearCache().then(function() {
        $state.go('menu.noticias', {media: media, pag: 0, cache: false});
      });
    };

    $scope.goToNew=function(item,media){

      ScrollService.setLastUrl($scope.currentState);
      $timeout(function(){
        $scope.$digest();

        //first of all, restart the information sved about last detail
        NewsService.setMediaUrl(null);
        NewsService.setIdNew(item.IDNOTICIA);
        NewsService.setThumbNails([]);
        NewsService.getSuperSupport(null);
        NewsService.setAutoPlay(false);
        var thumbs=["THUMB1","THUMB2","THUMB3","THUMB4","THUMB5"];
      ScrollService.setOffset(0);
        //in case of TV, PRESS or RADIO, save mediaUrl (mp4,mp3, pdf)
        switch (media){
          case 'RADIO':
          case 'PRESS':
          case 'TV':
            if (angular.isDefined(item.SUPERSOPORTE)){
              NewsService.setSuperSupport(item.SUPERSOPORTE);
            }
            //if has multimedia, thumbnails, save in the service
            if (angular.isDefined(item.MULTIMEDIA)) {
              NewsService.setMediaUrl(item.MULTIMEDIA);
            }
            //in case of TV also we must save the thumbnails
            for (var i=0;i<thumbs.length;i++) {
              if (angular.isDefined(item[thumbs[i]])) {
                NewsService.getThumbNails().push(item[thumbs[i]]);
              }
            }

                break;
          default:
                break;
        }
      $state.go('detalle',{date:item.FECHA,id:item.IDNOTICIA,media:media,support:item.SOPORTE});
      },500);
    };


  })
    .controller('noticiasCtrl', function(ConfigService,$ionicHistory,$timeout,ScrollService,$stateParams,$scope,$ionicNavBarDelegate,FilterService,UserService,NewsService,$state,$ionicLoading,$rootScope,ConfigService,$location) {

    //$rootScope.activeFilters = {value: false};
    $scope.noMoreItemsAvailable = false;

    console.log();
    $ionicLoading.show({
      template: '<div class="icon ion-loading-c loading-color">'
    });
    $timeout(function(){
      $ionicLoading.hide();
    },10000);
    $scope.offset=0;
    $scope.limit=ConfigService.getLimitPage();
    //the Page will be pass by param so we can keep in the url the page number
    if (angular.isDefined($rootScope.fromState) && $rootScope.fromState.name === 'detalle'){
      //is coming from detail

      if (ScrollService.getOffset() != null) {
        if (ScrollService.getOffset() >0) {
          $scope.limit = ScrollService.getOffset();
          //so, if we have to go to page 5, we load from 0 to page 5 (page * limit)
        }
      }
    }

    $ionicNavBarDelegate.showBackButton(false);//disable the back button
    $scope.news = [];
    $scope.user = UserService.getUser();
    $scope.filters = FilterService.getFilters();
    $scope.media = $scope.filters.media;
    $scope.loadedComplete = false;//just to check when data is loaded first time;

    /*NewsService.getNews($scope.user,$scope.filters.media,$scope.filters,null,$scope.limit,$scope.offset).then(function(data) {
         $ionicLoading.hide();
      $scope.news = $scope.news.concat(data.news.slice());
      if (!$scope.loadedComplete) {
        //first load, we need restore the limit page, and set the offset
        if ($scope.offset < ScrollService.getOffset()) {
          $scope.offset = ScrollService.getOffset();
          $scope.limit = ConfigService.getLimitPage();
          $scope.loadedComplete = true;
        }
        //update the url with page:

      }

      if (data.news.length ===0) {
        $scope.noMoreItemsAvailable=true;
      }
   });*/
    $scope.goToPreview=function(){
      $ionicHistory.clearCache().then(function() {
        $state.go('menu.preview-noticias');
      });
    };
    $scope.loadMore = function() {
      var options = {infiniteScroll: true};
      //if ($scope.loadedComplete) {
        NewsService.getNews($scope.user, $scope.filters.media, $scope.filters, options, $scope.limit, $scope.offset).then(function (data) {
          angular.forEach(data.news,function(value){
           // value.THUMB1="accesothumb_pub.php?ano=2015&mes=12&zona_id=1&fichero=201512042515_thumb1.jpg";//TEST
            if (angular.isDefined(value.THUMB1) && value.THUMB1 !==""){
              value.THUMB1=ConfigService.getMediaUrl()+value.THUMB1;
            }
          });
          $scope.news = $scope.news.concat(data.news.slice());
          if ($scope.offset < ScrollService.getOffset()) {
            $scope.offset = ScrollService.getOffset();
            $scope.limit = ConfigService.getLimitPage();

          } else {

            $scope.offset += $scope.limit;
          }
          $ionicLoading.hide();
          $scope.loadedComplete = true;

          //$state.go('menu.noticias', {media: $scope.media, pag: $scope.offset}, {notify: false});
          $location.search('page', $scope.offset);

          if (data.news.length === 0) {
            $scope.noMoreItemsAvailable = true;
          }
          $scope.$broadcast('scroll.infiniteScrollComplete');
        });
      //}
    };


    /*$scope.$on('filtersChanged', function() {
      $scope.filters = FilterService.getFilters();
      $ionicLoading.show({
        template: '<div class="icon ion-loading-c loading-color">'
      });
      NewsService.getNews($scope.user,$scope.filters.media,$scope.filters,null,null,null).then(function(data) {
        $scope.news = data;
        window.setTimeout(function() {
	  $ionicLoading.hide();
        },500);
	//$ionicLoading.hide();
      });
    });*/

    $scope.goToNew=function(item,media,autoplay){

      ScrollService.setLastUrl($scope.currentState);

      ScrollService.setOffset($scope.offset);
      $timeout(function(){
        $scope.$digest();

        //first of all, restart the information sved about last detail
        NewsService.setMediaUrl(null);
        NewsService.setIdNew(item.IDNOTICIA);
        NewsService.setThumbNails([]);
        NewsService.setAutoPlay(autoplay);
        var thumbs=["THUMB1","THUMB2","THUMB3","THUMB4","THUMB5"];
        ScrollService.setOffset(0);
        //in case of TV, PRESS or RADIO, save mediaUrl (mp4,mp3, pdf)
        switch (media){
          case 'RADIO':
          case 'PRESS':
          case 'TV':

            if (angular.isDefined(item.SUPERSOPORTE)){
              NewsService.setSuperSupport(item.SUPERSOPORTE);
            }
            //if has multimedia, thumbnails, save in the service
            if (angular.isDefined(item.MULTIMEDIA)) {
              NewsService.setMediaUrl(item.MULTIMEDIA);
            }
            //in case of TV also we must save the thumbnails
            for (var i=0;i<thumbs.length;i++) {
              if (angular.isDefined(item[thumbs[i]])) {
                NewsService.getThumbNails().push(item[thumbs[i]]);
              }
            }

            break;
          default:
            break;
        }
        $state.go('detalle',{date:item.FECHA,id:item.IDNOTICIA,media:media,support:item.SOPORTE});
      },500);
    };
})

.controller('detalleCtrl', function($ionicLoading,ScrollService,$location,$rootScope,$sce,$http,$timeout,$document,$ionicHistory,$cordovaInAppBrowser,$scope,$window,UserService,CategoryService,$state,$ionicNavBarDelegate,$stateParams,NewsService) {

    $scope.media= $stateParams.media;
    $scope.date= $stateParams.date;
    $scope.id = $stateParams.id;
    $scope.support= $stateParams.support;
    $scope.dataNew = null;
    $scope.extendedText=false;
    $scope.hasLink=false;//has a link to external web?
    $scope.loaded=false;
    $scope.errorLoading=false;
    $scope.thumbnails=[""];
    $scope.superSupport=null;
    $scope.mediaLoaded=false;//to render the video, audio tag
    $scope.autoPlay=NewsService.getAutoPlay();
    /*$ionicLoading.show({
      template: '<div class="icon ion-loading-c loading-color">'
    });*/
    if ($scope.media ==='TV' && NewsService.getThumbNails() !==null){
      $scope.thumbnails = NewsService.getThumbNails();
    }
    NewsService.getNew($scope.media,$scope.date,$scope.id).then(function(data) {
      //$ionicLoading.hide();
      $scope.dataNew = data;
      if ($scope.dataNew == "ERROR") {
        $scope.errorLoading=true;
      }
      $scope.loaded=true;

      $scope.extendedText = (angular.isDefined($scope.dataNew.ROLLO));
      if ($scope.media=='TWITTER') {
        //if is twitter, the title and the text are the same, so the title now is Twitter
        $scope.dataNew.TEMA = '';
      }
      $scope.hasLink = ((angular.isDefined($scope.dataNew.URL) && $scope.dataNew.URL.length >0));
    });
    if (NewsService.getSuperSupport() !== null) {
      $scope.superSupport = NewsService.getSuperSupport();
    }
    if ($scope.media === 'TV' || $scope.media === 'RADIO' || $scope.media ==='PRESS') {
      $scope.multimedia = {url: NewsService.getMediaUrl()};
      if ($scope.multimedia.url !==null) {
        if ($scope.media ==='PRESS') {
          //open in google reader, to be compatible with all devices:
          $scope.pdfurl = $sce.trustAsResourceUrl("http://docs.google.com/gview?embedded=true&url="+$scope.multimedia.url);
        }

        $scope.mediaLoaded=true;
        //If is a video, and the user clicked in autoplay, must be in fullscreen
        if ($scope.autoPlay) {
          $timeout(function () {
            var element = document.getElementById("autoVideo");
            if (element.requestFullscreen) {
              element.requestFullscreen();
            } else if (element.mozRequestFullScreen) {
              element.mozRequestFullScreen();
            } else if (element.webkitRequestFullscreen) {
              element.webkitRequestFullscreen();
            } else if (element.msRequestFullscreen) {
              element.msRequestFullscreen();
            }
          }, 1000);
        }
      }
      /*NewsService.getMedia($scope.media, $scope.date, $scope.id).then(function (data) {
        if (data != "error") {
          $scope.multimedia = {url: data};


          $scope.mediaLoaded = true;
          if ($scope.media ==='PRESS') {
            //open in google reader, to be compatible with all devices:
            $scope.pdfurl = $sce.trustAsResourceUrl("http://docs.google.com/gview?embedded=true&url="+$scope.multimedia.url);
          }
        }
      });*/
    }

    $scope.openLink=function(){
     // $window.open('http://www.google.com', '_system');
      var scheme;
      if(device.platform === 'iOS') {
        scheme = 'twitter://';
      }
      else if(device.platform === 'Android') {
        scheme = 'com.twitter.android';
      }

      appAvailability.check(
        scheme, // URI Scheme
        function() {  // Success callback
          window.open('twitter://user?screen_name=gajotres', '_system', 'location=no');
          console.log('Twitter is available');
        },
        function() {  // Error callback
          window.open('https://twitter.com/gajotres', '_system', 'location=no');
          console.log('Twitter is not available');
        }
      );

    };

    $ionicNavBarDelegate.showBackButton(true);//disable the back button

    $scope.goBack = function(){
      $ionicHistory.goBack();
      /*
      $scope.backUrl = ScrollService.getLastUrl();
      if ($scope.backUrl !=null) {
        $state.go($scope.backUrl.name,$scope.backUrl.stateParams);
      } else {
        $scope.backView = $ionicHistory.backView();
        $state.go($scope.backView.stateName, $scope.backView.stateParams);
      }*/
    };
    //$scope.resourceUrl = "http://test.can.mmi-e.com/accesovideo_pub.php?zona_id=1&mes=02&ano=2016&id=TVRZeA==&tipo=mp4";
    //$scope.resourceMp3 = "http://test.can.mmi-e.com/accesoradio_pub.php?zona_id=1&mes=02&ano=2016&id=Tmpjdw==&tipo=mp3";
    $scope.user = UserService.getUser();
    /*//$scope.categories = [{"IDCATEGORIA": "2", "NOMBRE": "Categoria 1"},{"IDCATEGORIA": "3", "NOMBRE": "Categoria 2"}];
    //$scope.categories = CategoryService.getCategories($scope.user);
    $scope.categories = CategoryService.getCategories($scope.user).then(function (data) {
      $scope.categories = data;
    });

    $scope.selectCategory = function (category) {
      CategoryService.setCurrentCategory(category);
      // $state.go('menu.noticias');
      $state.go('menu.detalle');
    };*/
})

.controller('multimediaCtrl', function($scope, $http) {

    $scope.getData = function() {
      $http.get("http://api.mmi-e.com/mmiapi.php/get_url_multimedia_tv/DFKGMKLJOIRJNG/1/02/2016/161")
        .success(function(data) {
          $scope.URL = data[0].URL;
        })
        .error(function(data) {
          alert("ERROR");
        });
      };

})

;
