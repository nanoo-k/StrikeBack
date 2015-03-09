/**
 *  createCampaign.controller.js
 */

// var strikestarter = angular.module('strikestarter');

strikestarter.controller('User', [ '$scope', '$sce', 'User', function($scope, $sce, User){

    this.user = User;

    // All data will hang off the glb obj
    this.Global = $scope.$parent.glb;

    /**
     *  Login user
     */
    $scope.loginUser = $.proxy(function (username, password) {

        console.log('made it');

        // var promise = this.user.loginUser( username, password );

        // promise
        //     .success( $.proxy(function(data, status, headers, config){

        //         // Save user token and data to Global.user obj
        //         this.user = data;
        //         console.log(this.user);

        //     }, this.Global))
        //     .error( function(data, status, headers, config) {
        //         console.log(data); // Log error
        //     });

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

}]);
