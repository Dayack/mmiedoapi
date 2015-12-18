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
    var filters = { media: 'ALL' };

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
    var lastFilters = null;

    this.getNews = function(user, filters, options) {
      options = options || {};
      var filtersInJson = JSON.stringify(filters);
      var defer = $q.defer();
      if (filtersInJson === lastFilters) {
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
        lastFilters = filtersInJson;
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
    var categories = null;
    var categoriesUser = null;
    var selectedCategories = null;

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
            categories.unshift({"IDCATEGORIA": "0", "NOMBRE": "TODAS"});
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

    this.setCurrentCategories = function (category) {
      selectedCategories = category;
    };

    this.getCurrentCategories = function () {
      return selectedCategories;
    };
    this.addCurrentCategories = function (cat) {
      selectedCategories.push(cat);
    };
    this.removeCurrentCategories = function (cat) {
      var posCat = -1;
      for (var i=0;i<selectedCategories.length;i++) {
        if (selectedCategories[i].IDCATEGORIA === cat.IDCATEGORIA) {
          posCat = i;
          break;
        }
      }
      selectedCategories = selectedCategories.splice(posCat,1);
      return selectedCategories;
    };
  })


  .service('FilterService', function (HttpService, $q) {
    var filters = {
      startDate: {},
      endDate: {},
      support_zones: [],
      new_zones: []
    };
    this.getFilters = function () {
      return filters;
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
      if (user === 'demo.old' && password === 'demoMMI') {
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
      }
      // END MOCKED REQUEST
      /*
       REAL REQUEST
       $http.get('/getusuarios_login/'+ConfigService.getApiKey()+'/'+ConfigService.getZona()+'/0/'+user+'/'+password).success(function(data,status){
       if (data instanceof Array && data.length >0) {
       deferred.resolve(data[0]);
       } else {
       deferred.resolve(data);
       }

       }).error(function(data,status){
       deferred.resolve("error");
       });*/
      return deferred.promise;
    };

    this.getCategories = function (user, filters) {
      //MOCKED REQUEST
      //---DELETE THIS WHEN THE REQUEST IS WORKING
      var deferred = $q.defer();
      if (user.LOGIN === 'demo.old') {
        deferred.resolve([
          {"IDCATEGORIA": "2", "NOMBRE": "AYUNTAMIENTO TELDE. PARTIDOS POLITICOS"},
          {"IDCATEGORIA": "3", "NOMBRE": "PUBLICIDAD CONSEJERIA DE TURISMO"},
          {"IDCATEGORIA": "4", "NOMBRE": "PUBLICIDAD CONSEJERIA DE ECONOMIA Y HACIENDA"},
          {"IDCATEGORIA": "33", "NOMBRE": "COALICION POR GRAN CANARIA"},
          {"IDCATEGORIA": "2", "NOMBRE": "AYUNTAMIENTO TELDE. PARTIDOS POLITICOS"},
          {"IDCATEGORIA": "3", "NOMBRE": "PUBLICIDAD CONSEJERIA DE TURISMO"},
          {"IDCATEGORIA": "4", "NOMBRE": "PUBLICIDAD CONSEJERIA DE ECONOMIA Y HACIENDA"},
          {"IDCATEGORIA": "33", "NOMBRE": "COALICION POR GRAN CANARIA"},
          {"IDCATEGORIA": "2", "NOMBRE": "AYUNTAMIENTO TELDE. PARTIDOS POLITICOS"},
          {"IDCATEGORIA": "3", "NOMBRE": "PUBLICIDAD CONSEJERIA DE TURISMO"},
          {"IDCATEGORIA": "4", "NOMBRE": "PUBLICIDAD CONSEJERIA DE ECONOMIA Y HACIENDA"},
          {"IDCATEGORIA": "33", "NOMBRE": "COALICION POR GRAN CANARIA"}
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


    this.getNews = function (user,filters,offset) {
      //MOCKED REQUEST
      //---DELETE THIS WHEN THE REQUEST IS WORKING
      var deferred = $q.defer();
      if (user.LOGIN === 'demo.old') {
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

