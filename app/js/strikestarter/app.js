'use strict';

// Create template-path variable for easy maintenance
var path = '/web/templates/';

var strikestarter = angular.module('strikestarter', ['ngRoute'], [ '$interpolateProvider', function($interpolateProvider) {
    // Twig uses {{ }}, so Angular now uses {[{ }]}
    $interpolateProvider.startSymbol("{{");
    return $interpolateProvider.endSymbol("}}");
}]);

strikestarter.config([ '$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
    
    $locationProvider.html5Mode(true);

    $routeProvider.when("/",
        {
            templateUrl: path + "homepage.html",
            controller: "Homepage"
        }
    )
    .when("/create/campaign/",
        {
            templateUrl: path + "create_campaign.html",
            controller: "CreateCampaign"       
        }
    )
    .otherwise({
        template: "<div>This route doesn't exist</div>"
    });
}]);
