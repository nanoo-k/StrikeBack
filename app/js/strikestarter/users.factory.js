/**
 *  users.factory.js
 */

strikestarter.factory('Users', [ '$http', function($http){

    /**
     *  Users obj is passed to whichever controller needs the user model.
     *  The user obj contains all the methods for getting/setting data as well
     *  as the data itself.
     *
     *  In this case, the user obj is set to the global controller which passes
     *  a reference thru inheritance to all other controllers.
     */
    var Users = {

        /**
         *  Get the user
         */
        getCampaigns: function () {

            var url = createURI('/api/campaigns/');

            return $http({
                method: 'GET',
                url: url,
                params: {getAll: true, limit: 20}
            });
        },

        /**
         *  Create a campaign
         */
        createCampaign: function (name, call_to_action, target) {
            var url = createURI('/api/campaigns/');

            return $http({
                method: 'POST',
                url: url,
                name: name,
                callToAction: call_to_action,
                target: target
            })
        }
    };

    // Return the users obj.
    // You'll need to call the users obj methods once assigning it to a controller's attr.
    return Users;

}]);
