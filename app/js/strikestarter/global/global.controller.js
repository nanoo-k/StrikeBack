/**
 *  homepage.controller.js
 */

// var strikestarter = angular.module('strikestarter');

strikestarter.controller('Global', [ '$scope', '$sce', 'User', function ($scope, $sce, User) {

    this.user = User;

}]);
