/**
 *  header.directive.js
 */

strikestarter.directive("sbHeader", function() {
    return {
        restrict: "E",
        transclude: false, // Tell where to transclude the element using the ng-transclude attr
        templateUrl: path + 'sb-header.html',
        link: function(scope, elements, attrs) {

        }
    };
});
