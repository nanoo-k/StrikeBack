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
        },

        /**
         *  The `username` property tells whether the username
         *  is the email or phone number. So this is a getter
         *  method to sift through that trouble for you.
         */
        getUsername: function() {
            switch (this.username) {
                case 'phone':
                    return this.phone;
                    break;
                case 'email':
                    return this.email;
                    break;
                default:
                    return 'No username is set.';
                    break;
            }
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
        },

        /**
         *  Create a campaign
         */
        joinCampaign: function (name, call_to_action, target, access_token) {
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
        },

        isEmpty: function () {
            return (_.isUndefined(this.data)) ? true : false;
        }
    };

    // Return the token obj.
    // You'll need to call the token obj methods once assigning it to a controller's attr.
    return User;

}]);
