/**
* jwtauth
*
* A simple middleware for parsing a JWt token attached to the request. If the token is valid, the corresponding user
* will be attached to the request.
*/
var   url 			= require('url')
	, User 			= require('../models/user')
	, jwt 			= require('jwt-simple')
	, secret 		= require('./secret.js')
	, db            = require('../models')
	, passport      = require('passport')

module.exports = function(req, res, next){

	// Check whether token exists ====================================================
	// Parse the URL, we might need this
	var parsed_url = url.parse(req.url, true)
	/**
	* Take the token from:
	*
	* - the POST value access_token
	* - the GET parameter access_token
	* - the x-access-token header
	* ...in that order.
	*/
	var token = (req.body && req.body.access_token) || parsed_url.query.access_token || req.headers["x-access-token"];
	if (token) {
		try {
			var decoded = jwt.decode(token, secret())
			if (decoded.exp <= Date.now()) {
				res.end('Access token has expired. Log in again to get a new one.', 400)	
			}
			db.User.find({ where: { 'id': decoded.iss } }).complete(function(err, user){
				if (!err) {	
					req.user = user	
					return next()
				}
			})
		} catch (err) {	
			return next()
		}
	} else {

		// If token doesn't exist, check whether user creds were sent =====================
		// Place token, expires and user in res.json if creds pass

		passport.authenticate('local-login', function(err, user, info) {
          if (err) {
            return next(err); // will generate a 500 error
          }
          
          if (! user) {
            return res.status(401).send({ success : false, message : info.message });
          }
            
          var expires = moment().add('days', 7).valueOf();
          var token = jwt.encode({
            iss: user.id,
            exp: expires
          }, app.get('jwtTokenSecret'));
           
          // This sends the token, expires and user info
          // Is identical to res.send() except that it converts non-JSON objs to JSON
          // Need to convert this so that it just passes an obj to be sent back to the user, but not sent yet.
          // Maybe use res.set() http://expressjs.com/api.html#res.send
          req.token({
            token : token,
            expires: expires,
            user: user.toJSON()
          });

          return next()

        })(req, res, next)

        // next()
	}
}