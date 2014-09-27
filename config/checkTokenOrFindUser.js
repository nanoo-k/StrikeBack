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
	, _      		= require('underscore')

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

		  // Check for existence of user
		  if (_.isUndefined(req.body.user)) {
		  	next();
		  } else {
		  	  // I don't want this to be findOrCreate. I want the user to say, "I'm looking for an existing user, not creating a new one."
			  db.User.find({ username: req.body.user.username })
	  			// .error(function(err){
	  			// 	res.send(err);
	  			// })
		        .success(function(err, user){
	        		if (!!err)
	              		res.send(err);

	              	if (user.verifyPassword(req.body.user.password)){
	              		res.send({success: false, message: "Wrong password"});
	              	} else {
	              		req.token = user.createUserToken();
						next();
	              	}
	      		});
		  }
	}
}