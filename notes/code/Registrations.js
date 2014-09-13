module.exports = function(sequelize, DataTypes) {
  var Registrations = sequelize.define('Registrations', {
    campaignId: DataTypes.BIGINT,
    userId: DataTypes.BIGINT,
  })
 
  return Registrations
  // return {}
}