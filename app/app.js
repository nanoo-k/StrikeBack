(function(){
    'use strict';

    // Create template-path variable for easy maintenance
    var path = '/bundles/driversidesite/juniper/';

    var juniper = angular.module('juniper', ['ngRoute'], [ '$interpolateProvider', function($interpolateProvider) {
        // Twig uses {{ }}, so Angular now uses {[{ }]}
        // $interpolateProvider.startSymbol("{[{");
        // return $interpolateProvider.endSymbol("}]}");
    }]);

    juniper.config([ '$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
        
        $locationProvider.html5Mode(true);

        $routeProvider.when("/",
            {
                templateUrl: path + "homepage/homepage.html",
                controller: "Homepage"
            }
        )
        .otherwise({
            template: "<div>This route doesn't exist</div>"
        });
    }]);

})();
