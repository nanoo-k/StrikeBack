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

		  db.User.findOrCreate({ username: req.body.user.username }, {
		        // Create user if this is a new user
		        username: req,
		        password: req.body.user.password,
		        phone: req.body.user.phone || null,
		        email: req.body.user.email || null
		        })
	  			// .error(function(err){
	  			// 	res.send(err);
	  			// })
		        .success(function(user, created){

		        	// If sent existing user (not created), check user password
	        		switch (created) {
	        			case false:
	    					if (!user.verifyPassword(req.body.user.password))
				        		// Move to next function without attaching user
				        		// (I'll be looking for the user in the endpoint. If none exists, I'll send back info saying, "Deal with this fact!")
			        			// return next(); 
			        			// Send JSON back, don't move on to API
			        			res.send({succeed: false, message: "Right user. Wrong password."})

		        			req.token = user.createUserToken();
		        			next();
			        		break;

	        			case true:
	        				req.token = user.createUserToken();
	        				next();
					        break;

			            default:
			            	res.send({success: false, message: "Not sure what happened. Maybe right user, maybe right password. Can't tell. Server problem."});
		            		break;

	        		}

          		});

          // return next()

        // next()
	}
}