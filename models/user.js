var   bcrypt 		= require('bcrypt-nodejs')
	, _				= require('underscore')
	, moment		= require('moment')
	, jwt			= require('jwt-simple')
	, secret	 	= require('../config/secret.js');

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        set:  function(req) {
        	
          // Username is either in the req's user obj or just in the req's body.
          usernameField = (!_.isUndefined(req.body.user)) ? req.body.user.username : req.body.username;
          // Set the user value
          user = (!_.isUndefined(req.body.user)) ? req.body.user : req.body;
          // The previous two steps let us do user[usernameField]
          this.setDataValue('username', user[usernameField]);
        }
    },
    password: {
        type: DataTypes.STRING,
        set:  function(v) {
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(v, salt);

            this.setDataValue('password', hash);
        }
    },
    phone: { type: DataTypes.BIGINT, allowNull: true, unique: true },
    email: { type: DataTypes.STRING, allowNull: true, unique: true }
  },{
  	instanceMethods: {
      verifyPassword: function(password, done) {
        return bcrypt.compareSync(password, this.password);
      },
      createUserToken: function(){

        // Create token
		    var expires = moment().add(7, 'days').valueOf();
        var token = jwt.encode({
          iss: this.id,
          exp: expires
        }, secret());

      		
        // Write token to DB with an expires column
           
        // This sends the token, expires and user info
        // Is identical to res.send() except that it converts non-JSON objs to JSON
        // Need to convert this so that it just passes an obj to be sent back to the user, but not sent yet.
        // Maybe use res.set() http://expressjs.com/api.html#res.send
        return {
          token : token,
          expires: expires,
          user: this
        };
      },
      addUserTokenToResponse: function(obj, user){
      	obj = obj || {};
      	user = (_.isUndefined(user.token)) ? user : user.token;

      	return (!_.isUndefined(user)) ? _.extend(obj, user) : obj;
      }
    }
  })
 
  return User
}