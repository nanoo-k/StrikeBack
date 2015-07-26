/**
 *  createCampaign.controller.js
 */

// var strikestarter = angular.module('strikestarter');

strikestarter.controller('LoginUser', [ '$scope', '$sce', function ($scope, $sce){

    // Instantiate user model
    this.user = $scope.$parent.glb.user;

    // All data will hang off the glb obj
    // this.Global = $scope.$parent.glb;

    /**
     *  Create user
     */
    $scope.loginUser = function (username, password) {

        // var user = this.$parent.glb.user;

        // user.username = username.$viewValue;
        // user.email = email.$viewValue;
        // user.phone = phone.$viewValue;
        // user.password = password.$viewValue;

        var promise = this.$parent.glb.user.loginUser(username, password);

        // console.log('made it');

        // var promise = this.user.loginUser( username, password );

        promise
            .success( $.proxy(function (data, status, headers, config) {

                // Save user token and data to Global.user obj
                // this.user = data;
                console.log(this.user);

                this.$parent.glb.user.data = data.user;
                this.$parent.glb.user.data.token = data.token;
                this.$parent.glb.user.data.expires = data.expires;

            }, this))
            .error( $.proxy( function (data, status, headers, config) {
                console.log(data); // Log error
            }, this));

    };

    /**
     *  Login user
     */
    // $scope.loginUser = function () {
        
    //     // var username = "scott@gmail.com";
    //     // var password = "ab12!@";

    //     console.log('yup');

    //     var promise = this.user.loginUser(username, password );

    //     promise
    //         .success( $.proxy(function(data, status, headers, config){

    //             // Save user token and data to Global.user obj
    //             this.user = data;
    //             console.log(this.user);

    //         }, this.Global))
    //         .error( function(data, status, headers, config) {
    //             console.log(data); // Log error
    //         });
    // };

}]);
