'use strict';

// Create template-path variable for easy maintenance
var path = '/web/templates/';

var strikestarter = angular.module('strikestarter', ['ui.router', 'lodash', 'ngSanitize'], [ '$interpolateProvider', function ($interpolateProvider) {
    // Twig uses {{ }}, so Angular now uses {[{ }]}
    $interpolateProvider.startSymbol("{{");
    return $interpolateProvider.endSymbol("}}");
}]);

strikestarter.config([ '$stateProvider', '$urlRouterProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider, $locationProvider) {
    
    $locationProvider.html5Mode(true);

    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: path + "/homepage.html",
            controller: "Homepage"
        })
        .state('createCampaign', {
            url: path + 'create_campaign.html',
            controller: "CreateCampaign"
        });
}]);
