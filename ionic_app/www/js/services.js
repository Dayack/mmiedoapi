angular.module('app.services', [])

.factory('BlankFactory', [function(){

}])
/**
 * Service that has the basic config info
 */
  .service('ConfigService', function() {
    var zona = '1';
    var api_key = 'DFKGMKLJOIRJNG';
    this.getZona = function(){
      return zona;
    };
    this.getApiKey = function(){
      return api_key;
    };

  })
/**
 * User Service, used to save user info
 */
.service('UserService', function(HttpService,$q){
    var user = null;
    /**
     *  Login, will send the login request, and save the user data in the Service, will return 'OK' or 'ERROR' to the controller
     * @param user
     * @param password
     */
    this.login = function (user,password) {
      var defer = $q.defer();
      HttpService.login(user,password).then(function(data) {
        //the answer from the HTTP was ok, not error and if user/password is ok
        if (data !== null && data != "error" && (data!==false)) {
            user = data.data;
            defer.resolve("OK");
        } else {
          user = null;
          defer.resolve("ERROR");
        }
      });
      return defer.promise;
    };

})
/**
 * HTTP Service, this service will centralize all API calls
 */
  .service('HttpService',function($http,$q,ConfigService) {
    /**
     *  Login API call
     * @param user - username
     * @param password - password
     * @returns {user} if the login was ok, the result will be a JSON user data, if not, will be 'error'
     */
    this.login = function(user,password) {
      //MOCKED REQUEST
      //---DELETE THIS WHEN THE REQUEST IS WORKING
      var deferred = $q.defer();
      if (user ==='demo.old' && password ==='demoMMI') {
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
  })
;

