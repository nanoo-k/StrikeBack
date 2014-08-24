// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express'); 		// call express
var app        = express(); 				// define our app using express
var bodyParser = require('body-parser');
var Bear       = require('./app/models/bear');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// var mongoose   = require('mongoose');
//mongoose.connect('mongodb://127.0.0.1/:27017'); // connect to our database
// mongoose.connect('127.0.0.1:27017/beardb'); // connect to our database

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



var port = process.env.PORT || 8080; 		// set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); 				// get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
//    do logging
    console.log('Something is happening.');
    next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
	res.json({ message: 'hooray! welcome to our api!' });	
});

// more routes for our API will happen here

// on routes that end in /bears
router.route('/bears')
//    create a bear (accessed at POST http://localhost:8080/api/bears)
    .post(function(req, res){
        var bear = Bear.build({
          name: req.body.name
        })
         
        bear
          .save()
          .complete(function(err) {
            if (!!err) 
                res.send(err);
            res.json({ message: 'Bear created!' });
          })
    })

    .get(function(req, res){
        Bear
          .findAll()
          .complete(function(err, bears) {
            if (!!err)
              res.send(err);

            console.log(bears);
            res.json(bears);
          });

        // Bear.find(function(err, bears){
        //     if (err)
        //         res.send(err);

        //     res.json(bears);
        // });
    });

// router.route('/bears/:bear_id')

//     // get the bear with that id (accessed at GET http://localhost:8080/api/bears/:bear_id)
//     .get(function(req, res){
//         // Bear.findById(req.params.bear_id, function(err, bear){
//         //     if (err)
//         //         res.send(err);
//         //     res.json(bear);
//         // });
//     })

//     // update the bear with this id (accessed at PUT http://localhost:8080/api/bears/:bear_id)
//     .put(function(req, res){
//         // Bear.findById(req.params.bear_id, function(err, bear){
//         //     if (err)
//         //         res.send(err)

//         //     bear.name = req.body.name;

//         //     bear.save(function(err){
//         //         if (err)
//         //             res.send(err)

//         //         res.json({ message: "Bear updated!" });
//         //     });
//         // });
//     })

//     .delete(function(req, res){
//         // Bear.remove({
//         //     _id: req.params.bear_id
//         // }, function(err, bear){
//         //     if (err)
//         //         res.send(err);
//         //     res.json({ message: 'Succesfully deleted' });
//         // });
//     });

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
