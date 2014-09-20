module.exports = function(sequelize, DataTypes) {
  var Token = sequelize.define('Token', {
    value: DataTypes.STRING,
    issued: DataTypes.DATE,
    expires: DataTypes.DATE
  })
 
  return Token
}