var bcrypt = require('bcrypt');

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    phone: { type: DataTypes.BIGINT, allowNull: true, unique: true },
    email: { type: DataTypes.STRING, allowNull: true, unique: true }
  },{
  	instanceMethods: {
      setPassword: function(password, done) {
        return bcrypt.genSalt(10, function(err, salt) {
          return bcrypt.hash(password, salt, function(error, encrypted) {
            this.password = encrypted;
            this.salt = salt;
            return done();
          });
        });
      },
      verifyPassword: function(password, done) {
        return bcrypt.compare(password, this.password, function(err, res) {
          return done(err, res);
        });
      }
    }
  })
 
  return User
}