/**
 *  homepage.controller.js
 */

// var strikestarter = angular.module('strikestarter');

strikestarter.controller('Homepage', [ '$scope', '$sce', 'Campaigns', function($scope, $sce, Campaigns){

    // Assign the site model to this controller's `site` attr
    this.campaigns = Campaigns;

    var Global = $scope.$parent.glb;
    
    // Use the site model's get method to retrieve the site info
    var promise = this.campaigns.getCampaigns(); // Todo: Include the Id dynamically

    promise
        .success( $.proxy(function(data, status, headers, config){
            console.log(data);
            
            // Bind to the Site obj
            angular.extend(this, data);

            this.thing = "rad";

            // Bind data to $scope which is then used in directives that need to do stuff when this data arrives
            // $scope.loadedSite = data.data;

        }, Global)) // Pass in the Campaigns object for the data to bind to
        .error( function(data, status, headers, config) {
            var error = 'error';
            error += '/n data: ' + data;
            error += '/n status: ' + status;
            error += '/n headers: ' + headers;
            error += '/n config: ' + config;
            
            console.log(error); // Log error
        });

}]);
