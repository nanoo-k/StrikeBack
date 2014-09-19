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
	, db            = require('../models');

module.exports = function(req, res, next){
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
				res.end('Access token has expired', 400)	
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
		next()
	}
}