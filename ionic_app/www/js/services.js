angular.module('app.services', [])

  .factory('BlankFactory', [function () {

  }])
/**
 * Service that has the basic config info
 */
  .service('ConfigService', function () {
    var zona = '1';
    var api_key = 'DFKGMKLJOIRJNG';
    this.getZona = function () {
      return zona;
    };
    this.getApiKey = function () {
      return api_key;
    };

  })
/**
 * User Service, used to save user info
 */
  .service('UserService', function (HttpService, $q) {
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
        if (data !== null && data != "error" && (data !== false)) {
          user = data;
          defer.resolve("OK");
        } else {
          user = null;
          defer.resolve("ERROR");
        }
      });
      return defer.promise;
    };

    this.logout = function() {
      user = null;
    };

    this.getUser = function () {
      return user;
    };
  })

  .service('FilterService', function (HttpService, $q) {
    var filters = {
      media: 'ALL',
      startDate: {},
      endDate: {},
      support_zones: [],
      new_zones: []
    };

    this.getFilters = function() {
      return filters;
    };

    this.setMedia = function(media) {
      filters.media = media;
    };
  })

  .service('NewsService', function (HttpService, $q) {

    var limit = 10;
    var news = [];
    var offset = 0;
    var lastSearchHash = null;

    this.getNews = function(user, filters, options) {
      options = options || {};
      var searchHash = JSON.stringify(user) + JSON.stringify(filters);
      var defer = $q.defer();
       
      if (lastSearchHash === searchHash) {
        if (options.infiniteScroll) {
          offset += limit;
          HttpService.getNews(user, filters, offset).then(function (data) {
            //the answer from the HTTP was ok, not error and if user/password is ok
            if (data !== null && data != "error" && (data !== false)) {
              news = news.concat(data);
              defer.resolve(news);
            } else {
              defer.resolve(news);
            }
          });
          return defer.promise;
          
        } else {
          return news;
        }
      } else {
        offset = 0;
        lastSearchHash = searchHash;
        HttpService.getNews(user, filters, offset).then(function (data) {
          //the answer from the HTTP was ok, not error and if user/password is ok
          if (data !== null && data != "error" && (data !== false)) {
            news = data;
            defer.resolve(news);
          } else {
            news = [];
            defer.resolve(news);
          }
        });
        return defer.promise;

      }
      return news;
    };
    
    
  })

/**
 * Category Service, used to save user info
 */
  .service('CategoryService', function (HttpService, $q) {
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
    var allSelected = false;
 
    /**
     *  getCategories, will get all user's categories
     * @param user
     */

    this.getCategories = function (user) {
      var defer = $q.defer();
      if (categoriesUser === user) {
        defer.resolve(categories);
      } else {
        HttpService.getCategories(user).then(function (data) {
          if (data !== null && data != "error" && (data !== false)) {
            categoriesUser = user;
            categories = data;
            //categories.unshift({"IDCATEGORIA": "0", "NOMBRE": "TODAS"});
            defer.resolve(categories);
          } else {
            categories = null;
            categoriesUser = null;
            defer.resolve(null);
          }
        });
      }

      return defer.promise;
    };

    this.setSelectedCategory = function (category) {
      allSelected = false;
      if (selectedCategory.IDCATEGORIA !== category.IDCATEGORIA) {
        selectedCategory = category;
        subCategories = selectedCategory.SUBCATEGORIAS;
      }
      if (selectedCategories.hasOwnProperty(category.IDCATEGORIA) && 
          selectedCategories[category.IDCATEGORIA].length !== 0) {
        category.selected = true;
      } else {
        category.selected = false;
      }
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
    };

    this.setCurrentCategories = function (category) {
      selectedCategories = category;
    };

    this.getCurrentCategories = function () {
      return selectedCategories;
    };
    
    this.deselectAllCategories = function () {
      allSelected = true;
      for (var categoryIndex=0;categoryIndex<categories.length;categoryIndex++) {
        _category = categories[categoryIndex];

        if (selectedCategories.hasOwnProperty(_category.IDCATEGORIA)) {
          _category.selected = false;

          for (var subCategoryIndex=0;subCategoryIndex<_category.SUBCATEGORIAS.length;subCategoryIndex++) {
		    _category.SUBCATEGORIAS[subCategoryIndex].selected=false;
          }
        }
      }
      selectedCategories = {}; 
    };
  })

  .service('PlacesService', function (HttpService, $q) {
  
    var allPlaces = false;
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
      /*if (user === 'demo.old' && password === 'demoMMI') {
        deferred.resolve({
          "IDUSUARIO": "41",
          "IDZONA": "1",
          "LOGIN": "demo.old",
          "PASS": "demoMMI",
          "NOMBRE": "Demo de Costa Rica",
          "APELLIDO1": "",
          "APELLIDO2": "",
          "EMAIL": "",
          "TWITTER": "",
          "TIPO": "U",
          "ACTIVO": "0",
          "TELEFONO": "",
          "CARGO": "",
          "IDTIPOUSUARIO": "0",
          "ULTIMOACCESO": "0000-00-00 00:00:00",
          "ENCUESTADO": "0"
        });
      } else {
        deferred.resolve(false);
      }*/
      // END MOCKED REQUEST

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

    this.getCategories = function (user, filters) {
      //MOCKED REQUEST
      //---DELETE THIS WHEN THE REQUEST IS WORKING
      var deferred = $q.defer();
      if (user.LOGIN === 'demo.old') {
        deferred.resolve([
          {"IDCATEGORIA": "1287", "NOMBRE": "Municipio de la Orotava", 
              "SUBCATEGORIAS": [{"IDCATEGORIA": "737", "NOMBRE": "APYMEVO"}, 
                                {"IDCATEGORIA": "8508", "NOMBRE": "Elecciones Ayuntamiento de La Orotava 2015"}, 
                                {"IDCATEGORIA": "6117", "NOMBRE": "Universidad Europea de Canarias"}]},
          {"IDCATEGORIA": "1286", "NOMBRE": "Municipio de Telde", 
              "SUBCATEGORIAS": [{"IDCATEGORIA": "736", "NOMBRE": "San Juan"}, 
                                {"IDCATEGORIA": "8507", "NOMBRE": "Elecciones Ayuntamiento de Telde 2015"}, 
                                {"IDCATEGORIA": "6116", "NOMBRE": "Instituto de Telde"}]},
          {"IDCATEGORIA": "1285", "NOMBRE": "Binter", 
              "SUBCATEGORIAS": [{"IDCATEGORIA": "735", "NOMBRE": "Aeropuerto de Santa Cruz Norte"}, 
                                {"IDCATEGORIA": "8506", "NOMBRE": "Aeropuerto de Santa Cruz Sur"}, 
                                {"IDCATEGORIA": "6115", "NOMBRE": "Aeropuerto de Telde"}]},
          {"IDCATEGORIA": "1284", "NOMBRE": "Municipio de Las Palmas", 
              "SUBCATEGORIAS": [{"IDCATEGORIA": "734", "NOMBRE": "Elecciones Ayuntamiento de Las Palmas 2015"}, 
                                {"IDCATEGORIA": "8505", "NOMBRE": "Puerto de la Cruz"}, 
                                {"IDCATEGORIA": "6114", "NOMBRE": "Universidad de Las Palmas de GC"}]},
        ]);
      } else {
        deferred.resolve([]);
      }
      // END MOCKED REQUEST
      /*
       REAL REQUEST
       $http.get('/getcategorias/'+ConfigService.getApiKey()+'/'+ConfigService.getZona()).success(function(data,status){
       if (data instanceof Array && data.length >0) {
       deferred.resolve(data);
       } else {
       deferred.resolve([]);
       }

       }).error(function(data,status){
       deferred.resolve("error");
       });*/
      return deferred.promise;
    };


    this.getPlaces = function (user, filters) {
      var deferred = $q.defer();
      if (user.LOGIN === 'demo.old') {
        deferred.resolve([
          {"IDPLACE": "1", "NOMBRE": "Tenerife"},
          {"IDPLACE": "2", "NOMBRE": "Fuerteventura"},
          {"IDPLACE": "3", "NOMBRE": "La Palma"},
          {"IDPLACE": "4", "NOMBRE": "El Hierro"},
          {"IDPLACE": "5", "NOMBRE": "Lanzarote"},
          {"IDPLACE": "6", "NOMBRE": "La Gomera"},
          {"IDPLACE": "7", "NOMBRE": "Gran Canaria"},
        ]);

      } else {
        deferred.resolved([]);
      }
      return deferred.promise;
    };


    this.getNews = function (user,filters,offset) {
       //window.setTimeout(function() {
	  
       //}, 3000);    

      //MOCKED REQUEST
      //---DELETE THIS WHEN THE REQUEST IS WORKING
      var deferred = $q.defer();
      if (user.LOGIN === 'demo.old' && filters.media === 'ALL') {
        if (offset === 0) {
	  deferred.resolve([
            {"title": "Noticia1", "media": "Prensa", "id": 1},
            {"title": "Noticia2", "media": "TV", "id": 2},
            {"title": "Noticia3", "media": "Prensa", "id": 3},
            {"title": "Noticia4", "media": "Internet", "id": 4},
            {"title": "Noticia5", "media": "TV", "id": 5},
            {"title": "Noticia6", "media": "Internet", "id": 6},
            {"title": "Noticia7", "media": "Internet", "id": 7},
            {"title": "Noticia8", "media": "Internet", "id": 8},
            {"title": "Noticia9", "media": "Internet", "id": 9},
            {"title": "Noticia10", "media": "Internet", "id": 10},
          ]);
        } else if (offset === 10) {
	  deferred.resolve([
            {"title": "Noticia11", "media": "Prensa", "id": 11},
            {"title": "Noticia12", "media": "TV", "id": 12},
            {"title": "Noticia13", "media": "Prensa", "id": 13},
            {"title": "Noticia14", "media": "Internet", "id": 14},
            {"title": "Noticia15", "media": "TV", "id": 15},
            {"title": "Noticia16", "media": "Internet", "id": 16},
            {"title": "Noticia17", "media": "Internet", "id": 17},
            {"title": "Noticia18", "media": "Internet", "id": 18},
            {"title": "Noticia19", "media": "Internet", "id": 19},
            {"title": "Noticia20", "media": "Internet", "id": 20},
          ]);
        } else if (offset === 20) {
	  deferred.resolve([
            {"title": "Noticia21", "media": "Prensa", "id": 21},
            {"title": "Noticia22", "media": "TV", "id": 22},
            {"title": "Noticia23", "media": "Prensa", "id": 23},
          ]);
        } else {
	  deferred.resolve([]);
        }
      } else if (user.LOGIN === 'demo.old' && filters.media === 'PRESS') {
        if (offset === 0) {
	  deferred.resolve([
            {"title": "Noticia1", "media": "Prensa", "id": 1},
            {"title": "Noticia3", "media": "Prensa", "id": 3},
            {"title": "Noticia11", "media": "Prensa", "id": 11},
            {"title": "Noticia13", "media": "Prensa", "id": 13},
            {"title": "Noticia21", "media": "Prensa", "id": 21},
            {"title": "Noticia23", "media": "Prensa", "id": 23},
          ]);
        } else {
	  deferred.resolve([]);
        }
      } else if (user.LOGIN === 'demo.old' && filters.media === 'INTERNET') {
        if (offset === 0) {
	  deferred.resolve([
            {"title": "Noticia4", "media": "Internet", "id": 4},
            {"title": "Noticia6", "media": "Internet", "id": 6},
            {"title": "Noticia7", "media": "Internet", "id": 7},
            {"title": "Noticia8", "media": "Internet", "id": 8},
            {"title": "Noticia9", "media": "Internet", "id": 9},
            {"title": "Noticia10", "media": "Internet", "id": 10},
            {"title": "Noticia14", "media": "Internet", "id": 14},
            {"title": "Noticia16", "media": "Internet", "id": 16},
            {"title": "Noticia17", "media": "Internet", "id": 17},
            {"title": "Noticia18", "media": "Internet", "id": 18},
          ]);
        } else if (offset === 10) {
	  deferred.resolve([
            {"title": "Noticia19", "media": "Internet", "id": 19},
            {"title": "Noticia20", "media": "Internet", "id": 20},
          ]);
        } else {
	  deferred.resolve([]);
        }
      } else {
        deferred.resolve([]);
      }
      // END MOCKED REQUEST
      /*
       REAL REQUEST
       var filters = FilterService.getFilters();
       //PARSE FILTERS TO QUERY
       $http.get('/getNoticias/'+ConfigService.getApiKey()+'/'+ConfigService.getZona()).success(function(data,status){
       if (data instanceof Array && data.length >0) {
       deferred.resolve(data);
       } else {
       deferred.resolve([]);
       }

       }).error(function(data,status){
       deferred.resolve("error");
       });*/
      return deferred.promise;
    };

  })
;

