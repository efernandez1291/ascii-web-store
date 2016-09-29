(function() {

'use strict';

angular
    .module('discountAsciiWarehouse.products')
    .factory('products', products);

products.$inject = ['$http', '$log', '$moment'];

function products($http, $log, $moment) {
    return {
      getAsciiFaces:getAsciiFaces,
      getNextResultSet:getNextResultSet
    };

    function getAsciiFaces() {
      return $http({
        url: '/api/products?limit=20',
        method: 'GET',
        transformResponse: function (data) {
          return formatNdJSON(data);
        }
      })
      .then(getAsciiFacesComplete)
      .catch(getAsciiFacesFailed);

      function getAsciiFacesComplete(response) {
        return response.data;
        $log.info('ndJSON Succeded for getAsciiFaces.');
      }

      function getAsciiFacesFailed(error) {
        $log.error('ndJSON Failed for getAsciiFaces.' + error.data);
      }
    }

    function getNextResultSet(skip) {
      return $http({
        url: '/api/products?limit=20&skip=' + skip,
        method: 'GET',
        transformResponse: function (data) {
          return formatNdJSON(data);
        }
      })
      .then(getNextResultSetComplete)
      .catch(getNextResultSetFailed);

      function getNextResultSetComplete(response) {
        return response.data;
        $log.success('ndJSON Succeded for getNextResultSet.');
      }

      function getNextResultSetFailed(error) {
        $log.error('ndJSON Failed for getNextResultSet.' + error.data);
      }
    }

    function formatNdJSON(data) {
      // Split ndJSON string into object
      var ndJSONObject = data.split('\n');
      // Remove last key/val pair because split creates an empty key/val pair at the end
      ndJSONObject.splice( (ndJSONObject.length - 1), 1);
      //Parse strings in ndJSON object, and return an array of objects
      var reformattedArray = ndJSONObject.map(function(string){
         return JSON.parse(string);
      });

      return formatDates(reformattedArray);
    }

    function formatDates(reformattedArray) {
      //Loop through the dates returned so that we can edit their values based on time posted
      angular.forEach(reformattedArray, function(value, key) {
        //Clean the date by parsing it to milliseconds since Jan 1, 1970 so that moment.js can interpolate it.
        var cleanDate = Date.parse(reformattedArray[key].date);
        //Cache a variable containing the differnce between the date posted and today in days, this will return an integer.
        var daysPostedFromNow = $moment().diff($moment(cleanDate), 'days');
        //If the differnce is more than 3 days...
        if (daysPostedFromNow >= 7) {
          //Clean up the existing data to exclude Time/Time Zone
          reformattedArray[key].date = $moment(cleanDate).format("MMMM Do YYYY");
        }
        //If the difference is less than 3 days...
        else {
          //Pass the relative time from now as the new date value for this product.
          reformattedArray[key].date = $moment(cleanDate).fromNow();
        }
      });

      return reformattedArray;
    }
}

})();
