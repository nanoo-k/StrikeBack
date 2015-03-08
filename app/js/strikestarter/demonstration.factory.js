/**
 *  demonstration.factory.js
 */


strikestarter.factory('Demonstration', [ '$http', function($http){

    /**
     *  Site obj is passed to whichever controller needs the site model.
     *  The site obj contains all the methods for getting/setting data as well
     *  as the data itself.
     *
     *  In this case, the site obj is set to the global controller which passes
     *  a reference thru inheritance to all other controllers.
     */
    var Demonstration = {

        /**
         *  Get the site
         *  siteId (int) is the integer id of the site to be retrieved
         */
        getSite: function(demonstrationId) {

            var url = createURI('/api/site/' + siteId);

            return $http({
                method: 'GET',
                url: url
            });
        }
    };

    // Return the site obj.
    // You'll need to call the site obj methods once assigning it to a controller's attr.
    return Site;

}]);
