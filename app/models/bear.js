// var mongoose     = require('mongoose');
// var Schema       = mongoose.Schema;

// var BearSchema   = new Schema({
// 	name: String
// });

// module.exports = mongoose.model('Bear', BearSchema);

var Sequelize = require('sequelize')
    , sequelize = new Sequelize('Bears', 'postgres', 'tuttut', {
        host: 'localhost',
        dialect: 'postgres',
        port: 5432
    });
sequelize
    .authenticate()
    .complete(function(err){
        if (!!err) {
            console.log('Unable to connect to database:', err)
        } else {
            console.log('Connection has been established successfully.')
        }
    });

var BearSchema = sequelize.define('Bear', {
	name: Sequelize.STRING
});

sequelize
  .sync({ force: true })
  .complete(function(err) {
     if (!!err) {
       console.log('An error occurred while creating the table:', err)
     } else {
       console.log('It worked!')
     }
  });

module.exports = BearSchema;	