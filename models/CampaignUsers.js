module.exports = function(sequelize, DataTypes) {
  var CampaignUsers = sequelize.define('CampaignUsers', {
    campaignId: DataTypes.BIGINT,
    userId: DataTypes.BIGINT,
  })
 
  return CampaignUsers
}