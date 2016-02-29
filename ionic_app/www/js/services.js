angular.module('app.services', [])

  .factory('BlankFactory', [function () {

  }])

  .factory('timeoutHttpIntercept', function ($rootScope, $q) {
    return {
      'request': function (config) {
        if (config.url.indexOf("getusuarios_categorias") >0) {

        } else {
          config.timeout = 15000;//15 seconds of timeout
        }
        return config;
      }
    };
  }
    )

  .factory('$localstorage', ['$window', function($window) {
    return {
      set: function(key, value) {
        $window.localStorage[key] = value;
      },
      get: function(key, defaultValue) {
        return $window.localStorage[key] || defaultValue;
      },
      setObject: function(key, value) {
        $window.localStorage[key] = JSON.stringify(value);
      },
      getObject: function(key) {
        return JSON.parse($window.localStorage[key] || '{}');
      }
    };
  }])
/**
 * Service that has the basic config info
 */
  .service('ConfigService', function () {
    var zona = '1';
    var api_key = 'DFKGMKLJOIRJNG';
    var mediaUrl='http://test.can.mmi-e.com/';
    this.getZona = function () {
      return zona;
    };
    this.getApiKey = function () {
      return api_key;
    };
    var limitPage = 10;
    this.getLimitPage = function() {
      return limitPage;
    };
    this.getMediaUrl=function(){
      return mediaUrl;
    };

  })

  //HELPER FOR DATES
  .service('DateHelperService',function(){
    //format the date to String DD-MM-YYYY
    this.formatDate=function(date) {
      day =  date.getDate();
      month = date.getMonth()+1;
      year = date.getFullYear();
      return (day<10 ? "0":"")+day+(month<10?"0":"")+month+year;
    };
    //get the Date of today
    this.getToday=function(){
      var today = new Date();
      today= new Date(today.setHours(0));
      today= new Date(today.setMinutes(0));
      today= new Date(today.setSeconds(0));
      today= new Date(today.setMilliseconds(0));
      return today;
    };

    //add or extract days to a date
    this.addDays=function(date,days) {
      var newDate = new Date();
      newDate.setTime(date.getTime() + (days* 24 * 60 * 60 * 1000));
      return newDate;
    };

    //transform YYYY-MM-DD to DDMMYYYY
    this.formatStringDate = function(date) {
      var stringDate = date.split("-");
      return stringDate[2]+stringDate[1]+stringDate[0];

    };

  })


/**
 * User Service, used to save user info
 */
  .service('UserService', function (HttpService, $q, $window,FilterService) {
    var user = null;
    /**
     *  Login, will send the login request, and save the user data in the Service, will return 'OK' or 'ERROR' to the controller
     * @param user
     * @param password
     */
    this.login = function (username, password) {
      var defer = $q.defer();
      HttpService.login(username, password).then(function (data) {
        //the answer from the HTTP was ok, not error and if user/password is ok
        if ((data !== null && data != "error" && (data !== false)) && angular.isDefined(data.IDUSUARIO)) {
          user = data;
          //MOCKED TEST DATA
         //user.IDUSUARIO=17640;//1445;
          $window.localStorage.setItem('user',JSON.stringify(data));
          defer.resolve("OK");
        } else {
          user = null;
          defer.resolve("ERROR");
        }
      });
      return defer.promise;
    };

    this.autoLogin = function() {
      user = JSON.parse($window.localStorage.getItem('user'));
      if (user !== null) {
        return true;
      } else {
        return false;
      }
    };

    this.logout = function() {
      user = null;
      $window.localStorage.removeItem('user');
      $window.localStorage.removeItem('categories');
      FilterService.resetFilters();
    };

    this.getUser = function () {
      if (user === null) {
        this.autoLogin();
      }
      return user;
    };
  })
/**
 * Service that has the filters saved
 */
  .service('FilterService', function (HttpService,DateHelperService, $q) {
    var filters = {
      media: 'TV',//by default we select TV, this filter is always set
      startDate: {
        date: null,
        text:null
      },
      endDate: {
        date: null,
        text:null
      },
      dateSelected:'5y',
      support_zones: [],
      new_zones: []
    };
    var filteredByDate = false;
    var filteredByOrigin = false;
    var filteredByPlace=false;
    this.setDateSelected=function(date) {
      filters.dateSelected=date;
    };
    this.getDateSelected=function(){
      return filters.dateSelected;
    };

    //restart dates the filter set the date from 1 month ago to now
    this.setMedia=function(media) {
      filters.media = media;
    };

    this.restartDates = function() {
      filters.endDate.date  = DateHelperService.getToday();
      filters.endDate.text = DateHelperService.formatDate(filters.endDate.date);
      filters.startDate.date =DateHelperService.addDays(filters.endDate.date,-1865);
      filters.startDate.text = DateHelperService.formatDate(filters.startDate.date);
      filters.dateSelected=null;
      //to end Date -30 days
    };

    this.getFilters = function() {
      if (filters.startDate.date ===null) {
        this.restartDates();
      }
      return filters;
    };

    this.setMedia = function(media) {
      filters.media = media;
    };

    this.setFromDate=function(dateFrom){
      filters.startDate.date = dateFrom;
      filters.startDate.text = DateHelperService.formatDate(filters.startDate.date);
    };


    this.setToDate=function(dateTo){
      filters.endDate.date = dateTo;
      filters.endDate.text = DateHelperService.formatDate(filters.endDate.date);
    };

    this.setFiltered=function(newFilter){
      filtered =newFilter;
    };
    this.setFilterByDate=function(filter) {
      filteredByDate = filter;
    };
    this.setFilterByOrigin= function(filter){
      filteredByOrigin=filter;
    };

    this.setFilterByPlace = function(filter){
      filteredByPlace=filter;
    };
    this.getFiltered=function(){
      return ((filteredByDate || filteredByOrigin) || filteredByPlace);
    };

    //restart when logout
    this.resetFilters = function(){
      filters = {
        media: 'TV',//by default we select TV, this filter is always set
        startDate: {
          date: null,
          text:null
        },
        endDate: {
          date: null,
          text:null
        },
        support_zones: [],
        new_zones: [],
        dateSelected: '5y'
      };
      filteredByDate=false;
      filteredByOrigin=false;
      filteredByPlace=false;
    };
  })

  .service('ScrollService',function(){
    var lastUrl=null;//last state visited
    var lastOffset=null;
    var lastScroll=null;
    this.getLastUrl=function(){
      return lastUrl;
    };
    this.setLastUrl=function(newUrl){
      lastUrl = newUrl;
    };
    this.setOffset=function(newOffset){
      lastOffset= newOffset;
    };
    this.getOffset=function(){
      return lastOffset;
    };
    this.setScroll=function(newScroll){
      lastScroll = newScroll;
    };
    this.getScroll=function(){
      return lastScroll;
    };
  })

  .service('PreviewCacheService',function(){
    var cachedBlocks=null;
    this.setCachedBlocks=function(blocks){
      cachedBlocks=blocks;
    };
    this.getCachedBlocks=function(){
      return cachedBlocks;
    };
    this.clearCachedBlocks=function(){
      cachedBlocks=null;
    };


  })
/**
 * Service to load the news
 */
  .service('NewsService', function (HttpService,CategoryService, $q,DateHelperService) {

    var limit = 10;
    var news = [];
    var offset = 0;
    var lastSearchHash = null;
    var thumbnails=[];
    var mediaUrl=null;
    var idNew=null;
    var autoPlay=false;
    var superSupport=null;
    var pdfUrl=null;
    this.setPdfUrl=function(url){
      pdfUrl=url;
    };
    this.getPdfUrl=function(){
      return pdfUrl;
    };
    this.setAutoPlay=function(state){
      autoPlay=state;
    };
    this.getAutoPlay=function(){
      return autoPlay;
    };
    this.setSuperSupport=function(newSup){
      superSupport=newSup;
    };
    this.getSuperSupport=function() {
      return superSupport;
    };
    this.setIdNew=function(id){
      idNew=id;
    };
    this.getIdNew=function(){
      return idNew;
    };

    this.setThumbNails=function(thumbs){
      thumbnails=thumbs;
    };
    this.getThumbNails=function(){
      return thumbnails;
    };

    this.setMediaUrl=function(url){
      mediaUrl=url;
    };

    this.getMediaUrl=function(){
      return mediaUrl;
    };

    //-- preview config block
    var blockLimit = 5;
    //save and load the last url to save the scroll position


    /**
     * Loads the news for user, filters, and options specified
     * @param user
     * @param type = type of the news to load 'TV','RADIO','SOCIAL','PRESS','TWITTER','INTERNET'
     * @param filters
     * @param options
     * @returns {*}
     */
    this.getNews = function(user,type, filters, options,new_limit,new_offset) {
      options = options || {};
      var offset = 0;
      var limit = 10;
      if (new_limit !== null) {
        limit = new_limit;
      }
      if (new_offset!==null) {
        offset = new_offset;
      }
      var categories = CategoryService.getSelectedCategories();
      var searchHash ="type="+type+ JSON.stringify(user) + JSON.stringify(filters)+"offset="+offset+"limit="+limit;
      var defer = $q.defer();
      var result = {
        type: type,
        news: []
      };
      if (angular.equals(categories,{})) {
        defer.resolve({
          type: type,
          news: []
        });
        return defer.promise;
      }
     /* if (lastSearchHash === searchHash) {

          result.news = news;
         // return news;
          defer.resolve(result);
          return defer.promise;
      //  }
      } else {*/
        lastSearchHash = searchHash;
        HttpService.getNews(user,type, filters,   offset  ,
           limit  ,categories).then(function (data) {
          //the answer from the HTTP was ok, not error and if user/password is ok

          if (data !== null && data != "error" && (data !== false)) {
            result.news = data;
            defer.resolve(result);
          } else {
            result.news = [];
            defer.resolve(result);
          }
        });
        return defer.promise;

     /* }
      result.news= news;
      return result;*/
    };

    this.getNew=function(media,date,id) {
      var defer = $q.defer();
      HttpService.getDetailNew(media,DateHelperService.formatStringDate(date),id).then(function(data){
         defer.resolve(data);

     });
      return defer.promise;
    };


    this.getMedia=function(media, date, id) {
      var defer = $q.defer();

      var pos= date.indexOf("-");
      var year = date.substring(0, pos);

      var pos2= date.indexOf("-", pos+1);
      var month = date.substring(pos+1, pos2);

      HttpService.getDetailMedia(media,month, year, id).then(function(data){
        //alert(data);
         defer.resolve(data);
      });
      return defer.promise;
    };



  })

/**
 * Category Service, used to save user info
 */
  .service('CategoryService', function (HttpService, $q,$localstorage,$window) {
    //List of all user categories
    var categories = [];
    //List of sub categories about selected category.
    var subCategories = [];
    //Category selected from Category menu to show sub categories
    var selectedCategory = [];

    // Current user's categories
    var categoriesUser = [];
    // Current selection (Checkbox enables)
    var selectedCategories = {};
	// Variable to known if all categories are selected
    var allSelected = true;
    var that = this;
    //save in localStorage the category status
    this.saveStatus=function(){
      var status={
        allSelected: allSelected,
        categories: categories,
        selectedCategories: selectedCategories,
        subCategories: subCategories,
        selectedCategory: selectedCategory,
        categoriesUser: categoriesUser
      };
      $localstorage.setObject('categories',status);

    };
    this.loadStatus=function(){
      var status = $localstorage.getObject('categories');
      if (status !==null && !angular.equals(status,{})) {
        allSelected = status.allSelected;
        categories = status.categories;
        selectedCategories = status.selectedCategories;
        subCategories = status.subCategories;
        categoriesUser = status.categoriesUser;
        return true;
      }
      return false;
    };

    this.clearStatus = function() {
      $window.localStorage.removeItem("categories");
      categories = [];
      selectedCategory=[];
      categoriesUser=[];
      allSelected=true;
    };
    /**
     *  getCategories, will get all user's categories
     * @param user
     */
    this.isAllSelected = function() {
      return allSelected;
    };

    this.getCategories = function (user) {
      var defer = $q.defer();
      if (angular.equals(categoriesUser,user) && categories !==[]) {
        defer.resolve(categories);
      } else {
        HttpService.getCategories(user).then(function (data) {
          if (data !== null && data != "error" && (data !== false)) {
            categoriesUser = user;
            //categories = data;
            //wee need merge all the trees
            if (categories === null) {
              categories = [];
            }
            angular.forEach(data, function(value, key) {
              angular.forEach(value.CONTENIDO,function(value1,key1){
                categories.push(value1);
              });
              //check if the father is the only node

            });

            //check all categories, is one node has not childrens, create children as the node himself
            angular.forEach(categories,function(value,key){
             if ( value.CHILDREN.length ===0) {
               var newSubCat = {};
               angular.copy(value,newSubCat);
               value.CHILDREN.push(newSubCat);
             }
            });
            that.saveStatus();
            //categories.unshift({"IDCATEGORIA": "0", "NOMBRE": "TODAS"});
            defer.resolve(categories);
          } else {
            categories = null;
            categoriesUser = null;
            that.saveStatus();
            defer.resolve(null);
          }
        });
      }

      return defer.promise;
    };

    this.setSelectedCategory = function (category) {
      allSelected = false;
      selectedCategory = category;
      subCategories = selectedCategory.CHILDREN;
      if (selectedCategories.hasOwnProperty(category.IDCATEGORIA) &&
          selectedCategories[category.IDCATEGORIA].length !== 0) {
        category.selected = true;
      } else {
        category.selected = false;
      }
      that.saveStatus();
    };

    this.getSelectedCategoryNombre = function () {
      return selectedCategory.NOMBRE;
    };

    this.getSubCategories = function () {
      return subCategories;
    };

    this.selectSubCategory = function (subCategory) {
      categoryId = selectedCategory.IDCATEGORIA;
      subCategoryId = subCategory.IDCATEGORIA;

      if (!selectedCategories.hasOwnProperty(categoryId)) {
		subCategory.selected = true;
        selectedCategory.selected = true;
        selectedCategories[categoryId] = [subCategoryId, ];
      } else if (selectedCategories[categoryId].indexOf(subCategoryId) == -1) {
        selectedCategories[categoryId].push(subCategoryId);
        selectedCategory.selected = true;
        subCategory.selected = true;
      } else {
        subCategory.selected = false;
        selectedCategories[categoryId].splice(selectedCategories[categoryId].indexOf(subCategoryId), 1);
        if (selectedCategories[categoryId].length === 0) {
          selectedCategory.selected = false;
        } else {
          selectedCategory.selected = true;
        }
      }
      that.saveStatus();
    };

    this.setCurrentCategories = function (category) {
      selectedCategories = category;
      that.saveStatus();
    };

    this.getCurrentCategories = function () {
      if (angular.equals({},selectedCategories)) {
        this.loadStatus();
      }
      return selectedCategories;
    };
//are some cateogries selected?
    this.areSelectedCategories = function() {
      return (!angular.equals({},selectedCategories)|| allSelected);
    };

    this.getSelectedCategories = function() {
      if (angular.equals({},selectedCategories)) {
        this.loadStatus();
      }
      if (allSelected) {
        var allCat = {};
        angular.forEach(categories,function(value,key) {
          if (!allCat.hasOwnProperty(value.IDCATEGORIA)) {
            allCat[value.IDCATEGORIA] = [];
          }
          angular.forEach(value.CHILDREN, function (subvalue, subkey) {
            allCat[value.IDCATEGORIA].push(subvalue.IDCATEGORIA);
          });
        });
            return allCat;
      } else {
        return selectedCategories;
      }
    };

    this.deselectAllCategories = function () {
      allSelected = true;
      for (var categoryIndex=0;categoryIndex<categories.length;categoryIndex++) {
        _category = categories[categoryIndex];

        if (selectedCategories.hasOwnProperty(_category.IDCATEGORIA)) {
          _category.selected = false;

          for (var subCategoryIndex=0;subCategoryIndex<_category.CHILDREN.length;subCategoryIndex++) {
		    _category.CHILDREN[subCategoryIndex].selected=false;
          }
        }
      }
      selectedCategories = {};
      that.saveStatus();
    };


  })

  .service('PlacesService', function (HttpService, $q) {

    var allPlaces = true;
    var places = [];
    var placesUser = null;
    var selectedPlaces = [];

    this.getPlaces = function (user) {
      var defer = $q.defer();
      if (placesUser === user) {
        defer.resolve(places);
      } else {
        HttpService.getPlaces(user).then(function (data) {
          if (data !== null && data != "error" && (data !== false)) {
            placesUser = user;
            places = data;
            defer.resolve(places);
          } else {
            places = null;
            placesUser = null;
            defer.resolve(null);
          }
        });
      }

      return defer.promise;
    };

	this.selectPlace = function (place) {
      allPlaces = false;
      if (selectedPlaces.indexOf(place.IDPLACE) > -1) {
        selectedPlaces.splice(selectedPlaces.indexOf(place.IDPLACE), 1);
        place.selected = false;
      } else {
        selectedPlaces.push(place.IDPLACE);
        place.selected = true;
      }
    };

    this.selectAll = function() {
      allPlaces = true;
      for (var placeIndex = 0; placeIndex < places.length; placeIndex++) {
        places[placeIndex].selected = false;
      }
      selectedPlaces = [];
    };
    this.areAllSelected=function(){
      return allPlaces;
    };

  })


  .service('OriginService', function (HttpService, $q) {

    var allOrigins = true;
    var origins = [];
    var originUser = null;
    var selectedOrigins = [];
    this.areAllSelected=function(){
      return allOrigins;
    };
    this.getOrigins = function (user) {
      var defer = $q.defer();
      if (originUser === user) {
        defer.resolve(origins);
      } else {
        HttpService.getOrigins(user).then(function (data) {
          if (data !== null && data != "error" && (data !== false)) {
            originUser = user;
            origins = data;
            defer.resolve(origins);
          } else {
            origins = null;
            originsUser = null;
            defer.resolve(null);
          }
        });
      }

      return defer.promise;
    };

    this.selectOrigin = function (origin) {
      allOrigins = false;
      if (selectedOrigins.indexOf(origin.IDPLACE) > -1) {
        selectedOrigins.splice(selectedOrigins.indexOf(origin.IDPLACE), 1);
        origin.selected = false;
      } else {
        selectedOrigins.push(origin.IDPLACE);
        origin.selected = true;
      }
    };

    this.selectAll = function() {
      allOrigins = true;
      for (var originIndex = 0; originIndex < origins.length; originIndex++) {
        origins[originIndex].selected = false;
      }
      selectedOrigins = [];
    };

  })



/**
 * HTTP Service, this service will centralize all API calls
 */
  .service('HttpService', function ($http, $q, ConfigService) {
    /**
     *  Login API call
     * @param user - username
     * @param password - password
     * @returns {user} if the login was ok, the result will be a JSON user data, if not, will be 'error'
     */
    this.login = function (user, password) {
      //MOCKED REQUEST
      //---DELETE THIS WHEN THE REQUEST IS WORKING
      var deferred = $q.defer();


       //REAL REQUEST
       $http.get('/getusuarios_login/'+ConfigService.getApiKey()+'/'+ConfigService.getZona()+'/0/'+user+'/'+password).success(function(data,status){
       if (data instanceof Array && data.length >0) {
       deferred.resolve(data[0]);
       } else {
       deferred.resolve(data);
       }

       }).error(function(data,status){
       deferred.resolve("error");
       });
      return deferred.promise;
    };

    this.getDetailNew = function(media,date,id){
      var deferred = $q.defer();
      var url="";
      switch (media) {
        case "PRESS":
          url="/getnoticiasprensa_detalle";
          break;
        case "TV":
          url="/getnoticiastv_detalle";
          break;
        case "RADIO":
          url="/getnoticiasradio_detalle";
          break;
        case "INTERNET":
          url="/getnoticiasinternet_detalle";
          break;
        case "SOCIAL":
        case "TWITTER":
          url="/getnoticiassocialmedia_detalle";
          break;
      }
      $http.get(url+'/'+ConfigService.getApiKey()+'/'+ConfigService.getZona()+'/'+id+'/'+date).success(function(data){
        if (angular.isDefined(data) && (angular.isArray(data) && data !== false)) {
          deferred.resolve(data[0]);
        } else {
          deferred.resolve("ERROR");
        }
        //alert(data);
      }).error(function(data){
        deferred.resolve("ERROR");
      });
      return deferred.promise;
    };

    this.getCategories = function (user, filters) {
      //MOCKED REQUEST
      //---DELETE THIS WHEN THE REQUEST IS WORKING
      var deferred = $q.defer();

      var canceller = $q.defer();
      // REAL REQUEST
      //alert('/getusuarios_categorias/'+ConfigService.getApiKey()+'/'+ConfigService.getZona()+'/'+user.IDUSUARIO);
      var config = {
        timeout: canceller.promise
      };
    $http.get('/getusuarios_categorias/'+ConfigService.getApiKey()+'/'+ConfigService.getZona()+'/'+user.IDUSUARIO,config).success(function(data,status){
       if (data instanceof Array && data.length >0) {
       deferred.resolve(data);
       } else {
       deferred.resolve([]);
       }

       }).error(function(data,status){
       deferred.resolve("error");
        console.log("status="+status);
       });
      return deferred.promise;
    };


    this.getDetailMedia = function (media,month, year, id) {
      var deferred = $q.defer();

      var url_tv = "/get_url_multimedia_tv";
      var url_radio = "/get_url_multimedia_radio";
      var url_press = "/get_url_pdf_prensa";

      var url_get = "";
      switch (media) {
        case "TV":
          url_get = url_tv;
          break;

        case "RADIO":
          url_get = url_radio;
          break;
        case "PRESS"://ni case of press the base url is not necessary
              url_get = url_press;
              break;
      }


      //$http.get("http://api.mmi-e.com/mmiapi.php/get_url_multimedia_tv/DFKGMKLJOIRJNG/1/02/2016/161")
      //alert('http://api.mmi-e.com/mmiapi.php/'+ url_get + '/' + ConfigService.getApiKey() + '/' + ConfigService.getZona() + '/' + month + '/' + year + '/' + id);
      $http.get(url_get + '/' +  ConfigService.getApiKey() + '/' + ConfigService.getZona() + '/' + month + '/' + year + '/' + id)
      .success(function(data) {
          //alert(data[0].URL);
          var final_url = "";
          //alert('http://test.can.mmi-e.com/' + data[0].URL);
          if (media !== 'PRESS') {
            final_url = 'http://test.can.mmi-e.com/' + data[0].URL;
          } else {
            final_url = data[0].URL;
          }
          deferred.resolve(final_url);
          //alert(data[0].URL);
        })
        .error(function(data) {
          //alert("ERROR");
          deferred.resolve("error");
        });

        return deferred.promise;

    };


    this.getPlaces = function (user, filters) {
      var deferred = $q.defer();
      //if (user.LOGIN === 'demo.old') {
        deferred.resolve([
          {"IDPLACE": "1", "NOMBRE": "Tenerife"},
          {"IDPLACE": "2", "NOMBRE": "Fuerteventura"},
          {"IDPLACE": "3", "NOMBRE": "La Palma"},
          {"IDPLACE": "4", "NOMBRE": "El Hierro"},
          {"IDPLACE": "5", "NOMBRE": "Lanzarote"},
          {"IDPLACE": "6", "NOMBRE": "La Gomera"},
          {"IDPLACE": "7", "NOMBRE": "Gran Canaria"},
        ]);

      /*} else {
        deferred.resolved([]);
      }*/
      return deferred.promise;
    };


   this.getOrigins = function (user, filters) {
      var deferred = $q.defer();
     // if (user.LOGIN === 'demo.old') {
        deferred.resolve([
          {"IDPLACE": "1", "NOMBRE": "Tenerife"},
          {"IDPLACE": "2", "NOMBRE": "Fuerteventura"},
          {"IDPLACE": "3", "NOMBRE": "La Palma"},
          {"IDPLACE": "4", "NOMBRE": "El Hierro"},
          {"IDPLACE": "5", "NOMBRE": "Lanzarote"},
          {"IDPLACE": "6", "NOMBRE": "La Gomera"},
          {"IDPLACE": "7", "NOMBRE": "Gran Canaria"},
        ]);

    /*  } else {
        deferred.resolved([]);
      }*/
      return deferred.promise;
    };

    /**
     *
     * @param user
     * @param type = 'RADIO','TV','SOCIAL','PRESS','TWITTER'
     * @param filters
     * @param offset
     * @returns {*|promise}
     */
    this.getNews = function (user,type,filters,offset, limit,categories) {

      var url_radio = "getnoticiasradio_x_categorias";
      var url_internet = "getnoticiasinternet_x_categorias";
      var url_tv = "getnoticiastv_x_categorias";
      var url_social = "getnoticiassocialmedia_x_categorias";
      var url_twitter = "getnoticiassocialmedia_x_categorias";
      var url_press = "getnoticiasprensa_x_categorias";
      var social_type = ""; /// the social_type is because the socialMedia and twitter are the same URL
      //1 : only twitter, 2: social without twitter, 3: all news )social + twitter)
      var using_social=false;
      var url_get = "";
      switch (type) {
        case "TV":
          url_get = url_tv;
          break;

        case "RADIO":
          url_get = url_radio;
          break;

        case "INTERNET":
          url_get = url_internet;
          break;

        case "SOCIAL":
          url_get = url_social;
          social_type="2";
          using_social=true;
          break;

        case "TWITTER":
          url_get = url_twitter;
          social_type="1";
          using_social=true;
          break;
        case "PRESS":
          url_get = url_press;
          break;
      }
       //window.setTimeout(function() {

       //}, 3000);

      //MOCKED REQUEST
      //---DELETE THIS WHEN THE REQUEST IS WORKING
      var deferred = $q.defer();

       //REAL REQUEST
       //var filters = FilterService.getFilters();
       //PARSE FILTERS TO QUERY
      var params = [];
      for (var property in categories) {
        if (categories.hasOwnProperty(property)) {
          // do stuff
          angular.forEach(categories[property], function(value,key) {
            params.push({"IDCATEGORIA": ""+ value});
          });
        }
      }
      //the API doesnt allow array of 1 category, so we must transform into an object
      if (params.length===1) {
        params = params[0];
      }

       $http.post('/'+url_get+'/'+ConfigService.getApiKey()+'/'+ConfigService.getZona()+'/'+filters.startDate.text+
       '/'+filters.endDate.text+'/'+offset+'/'+limit+
         (using_social ? ('/'+social_type ) : ""),params).success(function(data,status){
       if (data instanceof Array && data.length >0) {
       deferred.resolve(data);
       } else {
       deferred.resolve([]);
       }

       }).error(function(data,status){
       deferred.resolve("error");
       });
      return deferred.promise;
    };

  })
;
