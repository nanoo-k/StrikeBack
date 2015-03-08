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

    /**
     *  Utilities
     */

    // Ensure columns are of equal height
    $scope.ensureColumnWidth = function () {
        var mainContentHeight = $('.Main-Content').outerHeight();
        var sidebarHeight = $('.Sidebar').outerHeight();

        // Check which is larger and set that as the min height
        var minHeight = (mainContentHeight > sidebarHeight) ? mainContentHeight : sidebarHeight;

        $('.Main-Content').css({'min-height': minHeight});
        $('.Sidebar').css({'min-height': minHeight});    
    };

    $scope.clearColumnMinWidth = function () {
        var minHeight = 0;
        $('.Main-Content').css({'min-height': minHeight});
        $('.Sidebar').css({'min-height': minHeight});   
    };

}]);
