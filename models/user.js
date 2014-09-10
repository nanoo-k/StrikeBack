module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    phone: { type: DataTypes.BIGINT, allowNull: true },
    email: { type: DataTypes.STRING, allowNull: true }
  })
 
  return User
}