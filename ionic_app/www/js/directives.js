angular.module('app.directives', [])

.directive('blankDirective', [function(){

}])
  //date filter to show TODAY or the date formated
  .filter('DateNew', function($filter){
    return function(newDate) {
      date = new Date();
      newDate = newDate.split("-");
      date.setFullYear(newDate[0]);
      date.setMonth(parseInt(newDate[1])-1);
      date.setDate(parseInt(newDate[2]));
      //now we can compare dates
      date.setHours(0);
      date.setMinutes(0);
      date.setSeconds(0);
      date.setMilliseconds(0);
      today = new Date();
      today.setHours(0);
      today.setMinutes(0);
      today.setSeconds(0);
      today.setMilliseconds(0);
      if (today.getTime() === date.getTime()) {
        return "HOY";//check to translate
      } else {
        return $filter('date')(date, "dd/MM/yyyy");
      }
    };
  })
//disable repated items from the keyname
  .filter('unique', function() {
    return function (collection, keyname) {
      var output = [],
        keys = [];

      angular.forEach(collection, function (item) {
        var key = item[keyname];
        if (keys.indexOf(key) === -1) {
          keys.push(key);
          output.push(item);
        } /*else {
          console.log("noticia "+key+" repetida");
        }*/
      });
      return output;
    };
  })

//get the media name from the media Type
  .filter('mediaName', function($filter){
    return function(type) {
      switch (type) {
        case "TV":
              return "Televisión";
        case "RADIO":
              return "Radio";
        case "SOCIAL":
              return "Social Media";
        case "TWITTER":
              return "Twitter";
        case "PRESS":
              return "Prensa";
        case "INTERNET":
              return "Internet";
        default :
              return "";
      }
    };
  })
  .filter('limitationText',function() {
    return function(text,size) {
      if (text.length >size) {
        return text.substr(0,size)+"...";
      } else {
        return text;
      }

    };
  });

