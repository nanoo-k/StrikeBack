module.exports = function(sequelize, DataTypes) {
  var Campaign = sequelize.define('Campaign', {
    name: DataTypes.STRING,
    target: DataTypes.BIGINT,
    callToAction: DataTypes.STRING
  })
 
  return Campaign
}