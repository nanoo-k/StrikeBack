/**
 *  token.factory.js
 */

strikestarter.factory('User', [ '$http', function($http){

    /**
     *  Token obj is passed to whichever controller needs the token model.
     *  The token obj contains all the methods for getting/setting data as well
     *  as the data itself.
     *
     *  In this case, the token obj is set to the global controller which passes
     *  a reference thru inheritance to all other controllers.
     */
    var User = {

        /**
         *  Get the token
         */
        registerUser: function (email, phone, username, password) {

            var url = createURI('/api/users/');

            return $http({
                method: 'POST',
                url: url,
                data: {
                    "email": email,
                    "phone": phone,
                    "username": username, // either "email" or "phone"
                    "password": password // plain text for now
                }
            });
        },

        loginUser: function (username, password) {
            var url = createURI('/api/token/');

            return $http({
                method: 'POST',
                url: url,
                data: {
                    "username": username,
                    "password": password 
                }
            });
        }
    };

    // Return the token obj.
    // You'll need to call the token obj methods once assigning it to a controller's attr.
    return User;

}]);
