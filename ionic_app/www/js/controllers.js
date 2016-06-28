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
    $scope.canLogin=false;//to render the inputlogin
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
    } else {
      $scope.canLogin=true;
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


.controller('selectDateCtrl', function(PreviewCacheService,$ionicHistory,$scope,$state,FilterService,$rootScope,DateHelperService) {
    $scope.defaultDates= null;//if set false, is to activate filters, if false, are default dates the disable filters icon
    // , if null, the data has not been changed in the top options (today,yesterday..) so is changed in the datepicker
    //load from service
    $scope.optionSelected=FilterService.getDateSelected();
    $scope.directOption=false;
    $scope.data = {
      fromDate: new Date(),
      toDate: new Date()
    };
    $scope.showFrom = {value:null};
    $scope.showTo = {value:false};
    $scope.$on('$ionicView.afterEnter',
      function() {
        $scope.directOption=false;
      });

    //save the dates in the filter service and exit to the news blocks
    $scope.saveAndExit=function(){
      if ($scope.data.fromDate.getTime() > $scope.data.toDate.getTime()) {
        FilterService.setFromDate($scope.data.toDate);
        FilterService.setToDate($scope.data.fromDate);
      } else {
        FilterService.setFromDate($scope.data.fromDate);
        FilterService.setToDate($scope.data.toDate);
      }
      FilterService.setDateSelected($scope.optionSelected);
      $rootScope.$broadcast('filtersChanged');
      PreviewCacheService.clearCachedBlocks();
      $ionicHistory.clearCache().then(function() {
        $state.go('menu.preview-noticias');
      });
    };


    $scope.selectTime = function(time) {
      $scope.optionSelected=time;
      $scope.directOption=true;
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
      FilterService.setFilterByDate(/*!$scope.defaultDates*/);
    });

    $scope.$watch('data.toDate', function() {
       if ($scope.showTo.value===true) {
         $scope.showTo.value=false;
         $scope.showFrom.value=true;
         if ($scope.defaultDates === null) {
           $scope.defaultDates=false;
         }
         if (!$scope.directOption) {
           $scope.optionSelected = null;
         }
         FilterService.setFilterByDate(/*!$scope.defaultDates*/ $scope.optionSelected !== '5y');
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
    {news:[],ids:[], type:"TV", loading:true},
    {news:[],ids:[], type:"RADIO", loading:true},
    {news:[],ids:[], type:"PRESS", loading:true},
    {news:[],ids:[], type:"INTERNET", loading:true},
    {news:[],ids:[], type:"SOCIAL", loading:true},
    {news:[],ids:[], type:"TWITTER", loading:true}

  ];
    $ionicNavBarDelegate.showBackButton(false);//disable the back button
    $scope.loadedComplete= false;
    //Start loading
    $scope.loadBlocks = function() {
     /* $ionicLoading.show({
        template: '<div class="icon ion-loading-c loading-color">'
      });
      console.log("loading mask");*/

      //check if the previewData is loaded previously
      $scope.cachedBlocks=PreviewCacheService.getCachedBlocks();
      if ($scope.cachedBlocks !==null){
        $scope.blockNews = $scope.cachedBlocks;
       // $ionicLoading.hide();
        $scope.loadedComplete= true;
        console.log("hide by cache");
      } else {
        console.log("no cached");

        /*$timeout(function () {
          $ionicLoading.hide();
          console.log("loading mask HIDE by timeout");
        }, 10000);*/
        $scope.blocksLoaded = 0;//to keep the count of the blocks loaded
        $scope.filters = FilterService.getFilters();
        $scope.options = null;
        //load different MEDIAS
        NewsService.getNews($scope.user, "TV", $scope.filters, $scope.options, 5, 0).then(function (data) {
          for (var i = 0; i < $scope.blockNews.length; i++) {
            if ($scope.blockNews[i].type === data.type) {
              $scope.blockNews[i].loading=false;
              $scope.blockNews[i].news = data.news;
              $scope.blocksLoaded++;
            }
          }

        });

        //RADIO
        NewsService.getNews($scope.user, "RADIO", $scope.filters, $scope.options, 5, 0).then(function (data) {
          for (var i = 0; i < $scope.blockNews.length; i++) {
            $scope.blockNews[i].loading=false;
            if ($scope.blockNews[i].type === data.type) {
              $scope.blockNews[i].news = data.news;
              $scope.blocksLoaded++;
            }
          }

        });
        //PRESS
        NewsService.getNews($scope.user, "PRESS", $scope.filters, $scope.options, 5, 0).then(function (data) {
          for (var i = 0; i < $scope.blockNews.length; i++) {
            $scope.blockNews[i].loading=false;
            if ($scope.blockNews[i].type === data.type) {
              $scope.blockNews[i].news = data.news;
              $scope.blocksLoaded++;
            }
          }

        });
        //SOCIAL
        NewsService.getNews($scope.user, "SOCIAL", $scope.filters, $scope.options, 5, 0).then(function (data) {
          for (var i = 0; i < $scope.blockNews.length; i++) {
            $scope.blockNews[i].loading=false;
            if ($scope.blockNews[i].type === data.type) {
              $scope.blockNews[i].news = data.news;
              $scope.blocksLoaded++;
            }
          }

        });
        //INTERNET
        NewsService.getNews($scope.user, "INTERNET", $scope.filters, $scope.options, 5, 0).then(function (data) {
          for (var i = 0; i < $scope.blockNews.length; i++) {
            $scope.blockNews[i].loading=false;
            if ($scope.blockNews[i].type === data.type) {
              $scope.blockNews[i].news = data.news;
              $scope.blocksLoaded++;
            }
          }

        });
        //TWITTER
        NewsService.getNews($scope.user, "TWITTER", $scope.filters, $scope.options, 5, 0).then(function (data) {
          for (var i = 0; i < $scope.blockNews.length; i++) {
            $scope.blockNews[i].loading=false;
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
        /*$ionicLoading.hide();
        console.log("hide mask by load");*/
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

    /*console.log();
    $ionicLoading.show({
      template: '<div class="icon ion-loading-c loading-color">'
    });
    $timeout(function(){
      $ionicLoading.hide();
    },10000);*/
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
          $scope.news = $scope.news.concat(data.news.slice());
          if ($scope.offset < ScrollService.getOffset()) {
            $scope.offset = ScrollService.getOffset();
            $scope.limit = ConfigService.getLimitPage();

          } else {

            $scope.offset += $scope.limit;
          }
          //$ionicLoading.hide();
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

.controller('detalleCtrl', function(MediaManager,$ionicLoading,ScrollService,$location,$rootScope,$sce,$http,$timeout,$document,$ionicHistory,$cordovaInAppBrowser,$scope,$window,UserService,CategoryService,$state,$ionicNavBarDelegate,$stateParams,NewsService) {


    //video control
  /*  $scope.mediaOK=true;

    $scope.$on("ERRORMEDIA",function(){
      $scope.mediaOK=false;
      $scope.iframeUrl = $sce.trustAsResourceUrl($scope.multimedia.url);
      console.log("MEDIA CHANGED");
    });*/


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
    NewsService.setPdfUrl(null);
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
        var url = $scope.multimedia.url;
        /*var xhttp = new XMLHttpRequest();
        xhttp.open('HEAD', url);
        xhttp.onreadystatechange = function () {
          if (this.readyState == this.DONE) {
            console.log(this.status + " " + this.getResponseHeader("Content-Type"));//check answer type

            //load contentType
*/

        if ($scope.media ==='PRESS') {
          //open in google reader, to be compatible with all devices:
         // $scope.pdfurl = $sce.trustAsResourceUrl("http://docs.google.com/gview?embedded=true&url="+$scope.multimedia.url);//<----OK

           $scope.pdfurl = $sce.trustAsResourceUrl("https://drive.google.com/viewerng/viewer?pid=explorer&efh=false&a=v&chrome=false&embedded=true&url="+$scope.multimedia.url);

          NewsService.setPdfUrl($scope.pdfurl);
        }

        $scope.mediaLoaded=true;
        //If is a video, and the user clicked in autoplay, must be in fullscreen
         /* }
        };

        xhttp.send();*/
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
    $scope.goToPdf = function () {
      $state.go('pdf');
    };
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

.controller('pdfCtrl', function($scope, NewsService,$ionicHistory) {
   $scope.url=NewsService.getPdfUrl();
    $scope.goBack = function() {
      $ionicHistory.goBack();
    }
})
  .controller('dossierListCtrl',function($scope,$timeout,$ionicLoading,$ionicHistory,$cordovaDevice,$ionicHistory, DossierService,UserService,$state,$cordovaNetwork){
    $ionicLoading.show({
      template: '<div class="icon ion-loading-c loading-color">'
    });

    console.log("loading list");
    $scope.loadedData = function (data) {
      for (var i = 0; i < 7; i++) {
        var pdf_list = [];
        pdf_list.push({
          "IDARBOL": null,
          "TIPO": "PDF_PORTADA",
          "NOMBRE": "Portadas del día",
          loadingDossier: false
        });
        pdf_list = pdf_list.concat(angular.copy(data));
        angular.forEach(data,function(item){
          item.loadingDossier= false;
        });
        $scope.days[i].dossiers = pdf_list;
        //now check if some dossiers are downloaded
        var day_to_verify = $scope.days[i].day.format("YYYYMMDD");
        if ($scope.offlineList !== null) {
           if (angular.isDefined($scope.offlineList[day_to_verify])) {
            for (var j = 0; j < $scope.offlineList[day_to_verify].length; j++) {
              for (var k = 0; k <  $scope.days[i].dossiers.length; k++) {
                 if ( $scope.days[i].dossiers[k].type === $scope.offlineList[day_to_verify][j].type) {
                   if ( $scope.days[i].dossiers[k].IDARBOL === $scope.offlineList[day_to_verify][j].IDARBOL) {
                     $scope.days[i].dossiers[k] = angular.copy($scope.offlineList[day_to_verify][j]);
                     console.log("copied " + $scope.days[i].dossiers[k]);
                  }
                }
              }
            }
          }
        }
      }

      $ionicLoading.hide();

    };

    //first load offline list, and then load the online list

    //create list of 7 days
    $scope.cachedList= DossierService.getCachedDossier();
    $scope.days = [];
    $scope.user = UserService.getUser()
    $scope.offlineList = DossierService.getSavedPdfs();
    console.log("offline List:"+JSON.stringify($scope.offlineList));
    console.log("cached List:"+JSON.stringify($scope.cachedList));
    //load days
    for (var i = 0; i < 7; i++) {

      $scope.days.push({
        day: new moment().subtract(i, 'days'),
        dossiers: []
      });

    }
    //OFFLINE LIST
    //just offline saved PDF list
    if ($scope.offlineList !== null) {
      for (var i = 0; i < 7; i++) {
        var day_to_verify = $scope.days[i].day.format("YYYYMMDD");
        if (angular.isDefined($scope.offlineList[day_to_verify])) {
          console.log("day "+ day_to_verify + " copied");
          $scope.days[i].dossiers = angular.copy($scope.offlineList[day_to_verify]);
        }
      }
    }
    $ionicLoading.hide();

    //ONLINE LIST
    //the App is online, load online PDF list
    if ($scope.cachedList !== null) {
//loadeding Cached List
      $scope.loadedData($scope.cachedList);
    }
    else {
      //downloading list
      DossierService.getArbolesPDF($scope.user.IDPERFIL).then($scope.loadedData);
    }
//callback


    /**go to dossier or open downloaded Dossier*/
    $scope.goToDossier=function(dossier,day,save){
      console.log("download mode "+save);
      dossier.loadingDossier= true;
      console.log("select Dossier" + JSON.stringify(dossier));
      DossierService.setDossier(dossier);
      if (dossier.downloaded){
        //downlaoded dossier in the storage
        switch ($cordovaDevice.getPlatform()) {
          case "Android":
            cordova.plugins.fileOpener2.open(dossier.local_url, 'application/pdf', { //open external system
              error: function (e) {
                console.log('Error status: ' + e.status + ' - Error message: ' + e.message);
              },
              success: function () {
                console.log('file opened successfully');
              }
            });
            break;
          default:
            window.open(dossier.local_url, '_blank', 'location=no,closebuttoncaption=Close,enableViewportScale=yes');
            break;

        }
      } else {
        var dayFormated = day.format('YYYYMMDD');
        /*$ionicHistory.clearCache().then(function() {
          $state.go('dossier', {dossierId: dossier.IDARBOL, type: dossier.TIPO, day: dayFormated,cache:false});
        });*/
        $scope.day = dayFormated;
        $scope.dossier = {
          TIPO: dossier.TIPO,
          dossier: dossier.IDARBOL,
          day: dayFormated
        };
        $scope.downloadedPDF=false;

        ///_______________
        if ($scope.dossier.TIPO ==='PDF') {
          DossierService.getDossierPDFUrl($scope.dossier, $scope.user.IDPERFIL, $scope.day).then(function (data) {
            $ionicLoading.hide();

            $scope.pdf_url = data;
            console.log("opening PDF at " +data);
         //   $scope.url = $sce.trustAsResourceUrl(DossierService.getUrlVisor()+data);
            $scope.downloaded = false;
            $scope.ready = true;
            $scope.downloadAndOpen(save,dossier,dayFormated);
          });
        } else if ($scope.dossier.TIPO ==='PDF_PORTADA'){
          //PDF OF COVERS
          DossierService.getDossierPDFCoverUrl($scope.day).then(function (data) {
            $ionicLoading.hide();
            $scope.pdf_url = data;
            console.log("opening pdf at " + data);
         //   $scope.url = $sce.trustAsResourceUrl(DossierService.getUrlVisor()+data);
            $scope.downloaded = false;
            $scope.ready = true;
            $scope.downloadAndOpen(save,dossier,dayFormated);
          });
        }




      }
    };

    $scope.ref=null;

    $scope.emptyPDF=false;
    $scope.loadErrorCallBack=function(){
      console.log("error PDF not loaded");
      $scope.ref.close();
      $scope.ref=null;
    };
    $scope.downloadAndOpen=function(save,dossier,day){
      var fileURL = "";
      $scope.devicePlatform = $cordovaDevice.getPlatform();

      var downloaded_dossier_info = {
        IDARBOL:null,
        TIPO:null,
        NOMBRE:null
      };
      var fileName = day+ "_"+(dossier.TIPO ==="PDF" ? dossier.IDARBOL : "PORTADA")+".pdf";


        switch ($scope.devicePlatform) {
          case 'Android':
            fileURL = cordova.file.externalApplicationStorageDirectory + fileName;
            break;
          default:
            fileURL = cordova.file.documentsDirectory + fileName;
            break;
        }

      console.log("saving at "+ fileURL);
      // Android devices cannot open up PDFs in a sub web view (inAppBrowser) so the PDF needs to be downloaded and then opened with whatever
      // native PDF viewer is installed on the app.


      $scope.canDownload=false;
      $scope.downloading=true;
      var fileTransfer = new FileTransfer();

      var uri = encodeURI($scope.pdf_url);
      fileTransfer.download(//donwload
        uri,
        fileURL,
        function (entry) {
          console.log("entry: " + JSON.stringify(entry));
          $scope.localFileUri = entry.toURL();
          // window.plugins.fileOpener.open(entry.toURL());
          console.log("downloaded file:" + entry.toURL());
          dossier.loadingDossier = false;

          //--check the file
          window.resolveLocalFileSystemURL(entry.toURL(), function (fileEntry) {
            fileEntry.file(function (file) {
                console.log("FILE DATA: " + JSON.stringify(file));
                if (file.size > 100) {
                //size of file is correct
                  if (save) {
                    $scope.localFileUri = entry.toURL();
                    // window.plugins.fileOpener.open(entry.toURL());
                    console.log("saving " + entry.toURL() + " dossier:" + JSON.stringify(dossier));
                    downloaded_dossier_info.TIPO = dossier.TIPO;
                    downloaded_dossier_info.IDARBOL = dossier.IDARBOL;
                    downloaded_dossier_info.NOMBRE = dossier.NOMBRE;
                    downloaded_dossier_info.local_url = entry.toURL(); //url local
                    downloaded_dossier_info.downloaded = true;

                    DossierService.savePdf($scope.day, downloaded_dossier_info);
                    dossier.downloaded = true;
                    dossier.local_url = entry.toURL();
                  }
                  $timeout(function () {
                    $scope.downloading = false;
                    $scope.downloadedPDF = true;
                  });
                  //window.open(entry.toURL(), '_blank', 'location=no,closebuttoncaption=Close,enableViewportScale=yes');/*
                  switch ($cordovaDevice.getPlatform()) {
                    case "Android":
                      cordova.plugins.fileOpener2.open(entry.toURL(), 'application/pdf', { //open external system
                        error: function (e) {
                          console.log('Error status: ' + e.status + ' - Error message: ' + e.message);
                        },
                        success: function () {
                          console.log('file opened successfully');
                        }
                      });
                      break;
                    default:
                      console.log("opening " + entry.toURL());
                      $scope.ref = window.open(entry.toURL(), '_blank', 'location=no,closebuttoncaption=Close,enableViewportScale=yes');
                      /*if ( $scope.ref){
                       $scope.ref.addEventListener('loaderror',$scope.loadErrorCallback);
                       }*/
                      break;

                  }


                  /////////OPEN DOWNLOADED PDF

                  /////////////////

                } else {
                  console.log("no size pdf " + JSON.stringify(dossier));
                  //not pdf loaded, so dont save or open
                  $scope.emptyPDF=true;
                  $timeout(function(){
                    dossier.notAvailable=true;
                    $timeout(function(){
                      $scope.setAvailableDossier(dossier);

                    },5000);
                    dossier.loadingDossier=false;
                  });

                }

              },
              function (error) {
                console.log("error downloading");
                $scope.downloading = false;
                $scope.canDownload = true;
              },
              false
            );
          });
        }, function () {
          console.log("error");
        });
    };

    $scope.setAvailableDossier=function(dossier){

      dossier.notAvailable=false;
      console.log("size pdf " +JSON.stringify(dossier));
    };
    $scope.goNews = function () {
      $ionicHistory.clearCache().then(function () {
        $state.go('menu.preview-noticias');
      });
    };


  })
  .controller('dossierCtrl',function($scope,$ionicLoading,$timeout,$sce,$ionicHistory,$cordovaDevice,$state,DossierService,$stateParams,UserService) {
     $scope.goBack = function () {
     // $ionicHistory.goBack();
       $ionicHistory.clearCache().then(function() {
         $state.go('menu.dossiers');
       });
    }
    $ionicLoading.show({
      template: '<div class="icon ion-loading-c loading-color">'
    });
    $scope.downloaded = false;
    $scope.ready=false;
    $scope.dossier = DossierService.getDossier();
    $scope.user = UserService.getUser();
    $scope.day= $stateParams.day;
    //extract the dossier file if is downloaded, if not return null
    if (DossierService.getDownloadedDossier($scope.dossier)) {
      //open downloaded PDF
      $scope.downloaded = true;
      $scope.ready=true;

    } else {
      //get URL and open ONLINE
      if ($stateParams.type ==='PDF') {
        DossierService.getDossierPDFUrl($scope.dossier, $scope.user.IDUSUARIO, $scope.day).then(function (data) {
          $ionicLoading.hide();

          $scope.pdf_url = data;
          $scope.url = $sce.trustAsResourceUrl(DossierService.getUrlVisor()+data);
          $scope.downloaded = false;
          $scope.ready = true;
        });
      } else if ($stateParams.type ==='PDF_PORTADA'){
        //PDF OF COVERS
        DossierService.getDossierPDFCoverUrl($scope.day).then(function (data) {
          $ionicLoading.hide();
          $scope.pdf_url = data;
          $scope.url = $sce.trustAsResourceUrl(DossierService.getUrlVisor()+data);
          $scope.downloaded = false;
          $scope.ready = true;
        });
      }
    }


    //open PDF url

    $scope.canDownload=true;
    $scope.downloading=false;
    $scope.downloadPDF = function () {
      $scope.downloadedPDF=false;
      console.log("DOWNLOADING PDF");
      var fileURL = "";
      $scope.devicePlatform = $cordovaDevice.getPlatform();

      var downloaded_dossier_info = {
        IDARBOL:null,
        TIPO:null,
        NOMBRE:null
      };
      var fileName = $scope.day+ "_"+($scope.dossier.TIPO ==="PDF" ? $scope.dossier.IDARBOL : "PORTADA")+".pdf";

      if (save) {
        switch ($scope.devicePlatform) {
          case 'Android':
            fileURL = cordova.file.externalApplicationStorageDirectory + fileName;
            break;
          default:
            fileURL = cordova.file.documentsDirectory + fileName;
            break;
        }
      } else {//save in cache folder
        fileURL = cordova.file.cacheDirectory +fileName;
      }
      // Android devices cannot open up PDFs in a sub web view (inAppBrowser) so the PDF needs to be downloaded and then opened with whatever
      // native PDF viewer is installed on the app.


      $scope.canDownload=false;
      $scope.downloading=true;
      var fileTransfer = new FileTransfer();
      var uri = encodeURI($scope.pdf_url);
      fileTransfer.download(//donwload
        uri,
        fileURL,
        function (entry) {
          $scope.localFileUri = entry.toURL();
          // window.plugins.fileOpener.open(entry.toURL());
          console.log("downloaded file:"+entry.toURL());
          downloaded_dossier_info.TIPO = $scope.dossier.TIPO;
          downloaded_dossier_info.IDARBOL = $scope.dossier.IDARBOL;
          downloaded_dossier_info.NOMBRE = $scope.dossier.NOMBRE;
          downloaded_dossier_info.local_url = entry.toURL(); //url local
          downloaded_dossier_info.downloaded=true;
          $timeout(function(){
            $scope.downloading=false;
            $scope.downloadedPDF=true;
          });
         /* $scope.offlineList = DossierService.getSavedPdfs();
          if ($scope.offlineList === null) {
            $scope.offlineList = {};
          }
          if (!angular.isDefined($scope.offlineList[$scope.day])) {
            $scope.offlineList[$scope.day] = [];
          }
          $scope.offlineList[$scope.day].push(downloaded_dossier_info);*/
          DossierService.savePdf($scope.day, downloaded_dossier_info);

          /////////OPEN DOWNLOADED PDF

          /////////////////


        },
        function (error) {
          $scope.downloading=false;
          $scope.canDownload=true;
        },
        false
      );


      /*  break;
       default:


       // IOS and browser apps are able to open a PDF in a new sub web view window. This uses the inAppBrowser plugin

       var ref = window.open(url, '_blank', 'location=no,toolbar=yes,closebuttoncaption=Close PDF,enableViewportScale=yes');
       break;
       }*/
    };



  });
