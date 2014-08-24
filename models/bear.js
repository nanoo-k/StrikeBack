// var Sequelize = require('sequelize')
//     , sequelize = new Sequelize('Bears', 'postgres', 'tuttut', {
//         host: 'localhost',
//         dialect: 'postgres',
//         port: 5432
//     });
    
// sequelize
//     .authenticate()
//     .complete(function(err){
//         if (!!err) {
//             console.log('Unable to connect to database:', err)
//         } else {
//             console.log('Connection has been established successfully.')
//         }
//     });

var Bear = sequelize.define('Bear', {
	name: Sequelize.STRING
});

return Bear;	