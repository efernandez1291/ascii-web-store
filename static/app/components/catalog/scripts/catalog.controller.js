(function() {

'use strict';

angular
    .module('discountAsciiWarehouse.catalog')
    .controller('CatalogController', CatalogController);

CatalogController.$inject = ['$scope', '$moment', '$log', '$window', 'products'];

function CatalogController($scope, $moment, $log, $window, products) {
    var vm = this;
    //Set productsLoaded boolean to false to show loader
    vm.productsLoaded = false;
    //Set the initial sort order to id
    vm.sortOrder = "id";
    //This number will determine the amount of products to aprear before an ad shows up.
    vm.addPlacementNumber = 20;
    //Create an adID object that will store the id's for our ad queries.
    vm.adID = [];
    //True if user scrolled the bottom of the page, gets set to false once more products load.
    vm.userScrolledToBottom = false;
    //Variable with boolean informing if catalog can no longer load results.
    vm.endOfCatalog = false;

    init();

    function init() {
        //Get Ascii Faces promise...
        return getAsciiFaces()
          .then(getAsciiFacesSuccess);
    }

    function getAsciiFaces() {
      //Call our products factory for a products object
      return products.getAsciiFaces()
        .then(function(data) {
          //Set our vm object products to the data object returned
          return vm.products = data;
        });
    }

    function getAsciiFacesSuccess() {
      $log.info('products loaded');
      //If it succeeded set productsLoaded boolean to true to hide the loader
      vm.productsLoaded = true;
      //Enable checking for scroll to bottom of page
      vm.checkScrollToBottom(true);
      // //Preload next 20 results, pass in product.length to set skip value
      return preloadNextResultSet(vm.products.length)
        .then(function(){
          $log.info('pre-load complete');
        });
    }

    function preloadNextResultSet (skip) {
      return products.getNextResultSet(skip)
        .then(function(data){
          return vm.preloadedResults = data;
        });
    }

    function loadNextresults() {
      if (vm.preloadedResults) {
        //Add results to product object
        angular.forEach(vm.preloadedResults, function(value, key){
          vm.products.push(value);
        });
        //Reset preloadedResults to false
        vm.preloadedResults = false;
        //Reset userScrolledToBottom to false
        vm.userScrolledToBottom = false;
        //Pre load the next set of results if we don't have 100 already (manual cutoff)
        if (vm.products.length < 100) {
          preloadNextResultSet(vm.products.length)
            .then(function(){
              $log.info('pre-load complete');
            });
        }
        // Turn off scroll listener, set endOfCatalog variable to true
        else {
          vm.checkScrollToBottom(false);
          vm.endOfCatalog = true;
        }
      }
    }

    //Boolean passed to enable or disable scroll checking.
    vm.checkScrollToBottom = function(enable) {
      if (enable) {
        $window.onscroll = function() {
            if (($window.innerHeight + $window.scrollY) >= document.body.offsetHeight) {
                //User is at the bottom of the page
                vm.userScrolledToBottom = true;
                //LoadNextresults
                loadNextresults();
                //Scope apply to force digest;
                $scope.$apply();
            }
        };
      }
      else {
        $window.removeEventListener('scroll', false);
      }
    }

    //Param being passed is the index of the product right before the ad appears.
    //If vm.addPlacementNumber = 20 the first integer pased will be 19 then 29 and so on.
    //This function creates a new key/val pair in the adID object with the key being the integer passed in and the val a random number.
    vm.setRandomAdID = function(index) {
      //Cache a random integer between 1 and 16 because there are only 16 ads.
      var newAdID = Math.floor((Math.random() * 16) + 1);
      //Check the newAdID against the previous adID key/val if it exists
      if (newAdID === vm.adID[index - vm.addPlacementNumber]) {
        //The adID of the last ad is the same as our new number... rats!...
        //Add 1 to the id or if it is 16,change the id to 1.
        //This will ensure no two ads appear concurrently.
        vm.adID[index] = newAdID === 16 ? 1 : newAdID + 1;
      }
      //If the newAdID isn't the same number as the previous key/val pair value, or there is no previous key/val pair...
      else {
        //Create a new object with the index number param as the key, and newAdID as the value.
        vm.adID[index] = newAdID;
      }
    };
}

})();
