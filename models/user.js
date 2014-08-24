module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    username: DataTypes.STRING,
    password: DataTypes.STRING
    // phone: { DataTypes.INTEGER, allowNull: true, unique: true },
    // email: { DataTypes.EMAIL, allowNull: true, unique: true }
  // }, {
  //   classMethods: {
  //     associate: function(models) {
  //       User.hasMany(models.Roles)
  //     }
  //   }
  })
 
  return User
}