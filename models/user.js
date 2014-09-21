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
        	usernameField = (!_.isUndefined(req.body.user)) ? req.body.user.username : req.body.username;
        	// usernameField = req.body.username || req.body.user.username;
            this.setDataValue('username', req.body[usernameField]);
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
		  var expires = moment().add(7, 'days').valueOf();
		  console.log(secret());
          var token = jwt.encode({
            iss: this.id,
            exp: expires
          }, secret());

      		// console.log(this);
           
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
      addUserTokenToResponse: function(obj, req){
      	return (!_.isUndefined(req.token)) ? _.extend(obj, req.token) : obj;
      }
    }
  })
 
  return User
}