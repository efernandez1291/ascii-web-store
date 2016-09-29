(function() {

'use strict';

angular
    .module('discountAsciiWarehouse', [
  		'ui.router',
      'angular-momentjs',
  		'discountAsciiWarehouse.header',
      'discountAsciiWarehouse.catalog',
      'discountAsciiWarehouse.products'
    ]);
})();
