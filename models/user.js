var bcrypt = require('bcrypt-nodejs');

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    username: DataTypes.STRING,
    password:       {
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
      // setPassword: function(password, done) {
      //   return bcrypt.genSalt(11, function(err, salt) {
      //     return bcrypt.hash(password, salt, function(){}, function(error, encrypted) {
      //       this.password = encrypted;
      //       this.salt = salt;
      //       return done();
      //     });
      //   });
      // },
      verifyPassword: function(password) {
        return bcrypt.compare(password, this.password, function(err, res) {
          // return done(err, res);
        });
      }
    }
  })
 
  return User
}