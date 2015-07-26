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
    $scope.onCreateCampaign = function (campaign_name, call_to_action, campaign_target, username, password) {

        // if (this['Global']['user']['username'] === void 0) return console.log('Not logged in.');

        var access_token = this.cc.user.data.token;

        if (_.isUndefined(access_token)) {
            if (!_.isUndefined(username) && !_.isUndefined(password)) {

                this.loginUser(this.createCampaign);

            } else {
                // Alert user of issue
                alert('Since you are not logged in you must include both a username and password.');

                // Prevent rest of script from running
                return;
            }
        } else {
            this.createCampaign();
        }

    };

    $scope.createCampaign = function () {
        var cc = this.$parent.glb.campaigns;
        var access_token = this.cc.user.data.token;
        var promise = cc.createCampaign(cc.name, cc.callToAction, cc.target, access_token);

        promise
            .success( $.proxy( function (data, status, headers, config) {
                console.log(data);

                // $scope.$parent.glb.campaigns

            }, this))

            .error( function (data, status, headers, config) {
                console.log(data); // Log error
            });
    };

    $scope.loginUser = function (callBack) {
        var u = this.cc.user.data;
        var promise = this.$parent.glb.user.loginUser(u.username, u.password);

        promise
            .success( $.proxy(function (data, status, headers, config) {

                // Save user token and data to Global.user obj
                // this.user = data;
                console.log(this.user);

                this.$parent.glb.user.data = data.user;
                this.$parent.glb.user.data.token = data.token;
                this.$parent.glb.user.data.expires = data.expires;

                callBack();

            }, this))
            .error( $.proxy( function (data, status, headers, config) {
                console.log(data); // Log error

                alert(data);
                return;
            }, this));
    };

    /**
     *  View helpers
     */
    $scope.hasNoUserToken = function (token) {
        return (_.isUndefined(token)) ? true : false;
    }

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
