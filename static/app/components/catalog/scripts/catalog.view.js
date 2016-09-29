(function() {

'use strict';

angular
    .module('discountAsciiWarehouse.catalog')
    .config(function ($stateProvider) {
      $stateProvider
            .state('catalog', {
              url: '/catalog',
              templateUrl: './views/catalog.html',
              controller: 'CatalogController as catalog'
            });
    });

})();
