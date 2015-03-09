/**
 *  campaigns.factory.js
 */

strikestarter.factory('Campaigns', [ '$http', function($http){

    /**
     *  Campaigns obj is passed to whichever controller needs the campaigns model.
     *  The campaigns obj contains all the methods for getting/setting data as well
     *  as the data itself.
     *
     *  In this case, the campaigns obj is set to the global controller which passes
     *  a reference thru inheritance to all other controllers.
     */
    var Campaigns = {

        /**
         *  Get the campaigns
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
        createCampaign: function (name, call_to_action, target, access_token) {
            var url = createURI('/api/campaigns/');

            return $http({
                method: 'POST',
                url: url,
                data: {
                    "campaign" : {
                        "name": name,
                        "callToAction": call_to_action,
                        "target": target
                    },
                    "user": {
                        "access_token": access_token
                    }
                }
            })
        }
    };

    // Return the campaigns obj.
    // You'll need to call the campaigns obj methods once assigning it to a controller's attr.
    return Campaigns;

}]);
