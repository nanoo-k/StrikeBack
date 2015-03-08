/**
 *  homepage.controller.js
 */

// var strikestarter = angular.module('strikestarter');

strikestarter.controller('Homepage', [ '$scope', '$sce', 'Campaigns', function($scope, $sce, Campaigns){

    var self = this;

    // Assign the site model to this controller's `site` attr
    this.campaigns = Campaigns;
    
    // Use the site model's get method to retrieve the site info
    var promise = this.campaigns.getCampaigns(); // Todo: Include the Id dynamically

    promise
        .success( $.proxy(function(data, status, headers, config){
            console.log(data);
            
            // Bind to the Site obj
            // angular.extend(this, data.data);

            // Bind data to $scope which is then used in directives that need to do stuff when this data arrives
            // $scope.loadedSite = data.data;

            // Convert description (which containts HTML) to parsed string
            // Implement in view within Global scope using ng-html-bind="descriptionToHtml"
            // $scope.descriptionToHtml = $sce.trustAsHtml(this.homepage.description);

        }, Campaigns)) // Pass in the Campaigns object for the data to bind to
        .error( function(data, status, headers, config) {
            var error = 'error';
            error += '/n data: ' + data;
            error += '/n status: ' + status;
            error += '/n headers: ' + headers;
            error += '/n config: ' + config;
            
            console.log(error); // Log error
        });

}]);
