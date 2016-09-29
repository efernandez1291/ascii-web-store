(function() {

'use strict';

angular
    .module('discountAsciiWarehouse')
    .config(function ($urlRouterProvider, $locationProvider) {
      $urlRouterProvider.otherwise('catalog');
    });
})();
