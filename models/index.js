var fs        = require('fs')
  , path      = require('path')
  , Sequelize = require('sequelize')
  , lodash    = require('lodash')
  , db        = {}

var sequelize = new Sequelize('Bears', 'thepeople', '', {
                        host: 'localhost',
                        dialect: 'postgres',
                        port: 5432
                    })

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== 'index.js')
  })
  .forEach(function(file) {
    var model = sequelize.import(path.join(__dirname, file))
    db[model.name] = model
  })
 
Object.keys(db).forEach(function(modelName) {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db)
  }
})

// describe relationships
// var User     = db["User"],
//     Campaign = db["Campaign"];

  // User joins many campaigns. Campaign has many registered users.
db["User"].hasMany(db["Campaign"], { as: "Registrations", through: "Registrations" });
db["Campaign"].hasMany(db["User"], { as: "Registrations", through: "Registrations" });

  // Campaign has many owners (as users). Users own many campaigns.
db["Campaign"].hasMany(db["User"], { as: "Owner", through: "CampaignOwners" });
db["User"].hasMany(db["Campaign"], { as: "Owns", through: "CampaignOwners" });
 

// console.log(User);

module.exports = lodash.extend({
  sequelize: sequelize,
  Sequelize: Sequelize
}, db)