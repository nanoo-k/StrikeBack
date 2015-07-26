/**
 *  homepage.controller.js
 */

// var strikestarter = angular.module('strikestarter');

strikestarter.controller('Global', [ '$scope', '$sce', 'User', 'Campaigns', function ($scope, $sce, User, Campaigns) {

    this.user = User;
    this.campaigns = Campaigns;

}]);
