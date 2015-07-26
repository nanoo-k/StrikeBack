/**
 *  createCampaign.controller.js
 */

// var strikestarter = angular.module('strikestarter');

strikestarter.controller('CreateCampaign', [ '$scope', '$sce', function($scope, $sce){

    // Assign the site model to this controller's `site` attr
    this.campaigns = Campaigns;
    this.user = $scope.$parent.glb.user;

    this.Global = $scope.$parent.glb;

    /**
     *  Create campaign
     */
    $scope.createCampaign = $.proxy(function () {

        if (this['Global']['user'] === void 0) return console.log('Not logged in.');

        var promise = this.campaigns.createCampaign('Strike Disaster', 'We want you to avoid disaster. ...by striking!', 20, this.Global.user.token);
        promise
            .success( $.proxy(function(data, status, headers, config){
                console.log(data);
            }, this.Global))
            .error( function(data, status, headers, config) {
                console.log(data); // Log error
            });

    }, this);

    /**
     *  Create user
     */
    $scope.createUser = $.proxy(function () {
        

        var email = "scott@gmail.com";
        var phone = 4155187878;
        var username = 'email';
        var password = 'ab12!@';

        var promise = this.user.registerUser(email, phone, username, password );

        promise
            .success( $.proxy(function(data, status, headers, config){

                // Save user token and data to Global.user obj
                this.user = data;
                console.log(this.user);

            }, this.Global))
            .error( function(data, status, headers, config) {

                console.log(data); // Log error
            
            });
    }, this);

    /**
     *  Login user
     */
    $scope.loginUser = $.proxy(function () {
        
        var username = "scott@gmail.com";
        var password = "ab12!@";

        var promise = this.user.loginUser(username, password );

        promise
            .success( $.proxy(function(data, status, headers, config){

                // Save user token and data to Global.user obj
                this.user = data;
                console.log(this.user);

            }, this.Global))
            .error( function(data, status, headers, config) {
                console.log(data); // Log error
            });
    }, this);

    // $scope.createCampaign = function () {
    //     console.log('whats up');

    //     // Use the site model's get method to retrieve the site info
    //     // var promise = this.campaigns.createCampaign();

    //     // promise
    //     //     .success( $.proxy(function(data, status, headers, config){
    //     //         console.log(data);
                
    //     //         // Bind to the Site obj
    //     //         angular.extend(this, data);

    //     //         this.thing = "rad";

    //     //         // Bind data to $scope which is then used in directives that need to do stuff when this data arrives
    //     //         // $scope.loadedSite = data.data;

    //     //     }, Global)) // Pass in the Campaigns object for the data to bind to
    //     //     .error( function(data, status, headers, config) {
    //     //         var error = 'error';
    //     //         error += '/n data: ' + data;
    //     //         error += '/n status: ' + status;
    //     //         error += '/n headers: ' + headers;
    //     //         error += '/n config: ' + config;
                
    //     //         console.log(error); // Log error
    //     //     });
    // };

}]);
