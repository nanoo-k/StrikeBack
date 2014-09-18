var bcrypt = require('bcrypt-nodejs');

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        set:  function(req) {
            this.setDataValue('username', req.body[req.body.username]);
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
      }
    }
  })
 
  return User
}