(function() {

'use strict';

angular
    .module('discountAsciiWarehouse.header')
    .directive('dawHeader', dawHeader);

function dawHeader() {
    return {
		restrict: 'E',
		transclude: true,
		templateUrl: './views/header.html',
	};
}

})();
