// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express         = require('express')
    , app           = express()
    // , routes        = require('./routes')
    , bodyParser    = require('body-parser')
    , db            = require('./models/db')
    , Bear          = require('./app/models/bear')

// configure app to use bodyParser()
// this will let us get the data from a POST
app.set('port', process.env.PORT || 3000)
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.logger('dev'))
app.use(bodyParser.json())
app.use(express.urlencoded())
app.use(app.router)
app.use(express.static(path.join(__dirname, 'public')))

// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler())
}

db
  .sequelize
  .sync({ force: true })
  .complete(function(err) {
    if (err) {
      throw err[0]
    } else {
      http.createServer(app).listen(app.get('port'), function(){
        console.log('Express server striking back on port ' + app.get('port'))
      })
    }
  })


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
        var user = db.User.build({
          username: req.body.username,
          password: req.body.password,
          phone: req.body.phone,
          email: req.body.email
        })
         
        user
          .save()
          .complete(function(err) {
            if (!!err) 
                res.send(err);
            res.json({ message: 'User created!' });
          })
    })

    .get(function(req, res){
        db.User
          .findAll()
          .complete(function(err, users) {
            if (!!err)
              res.send(err);

            res.json(users);
          });
    });

// router.route('/bears/:bear_id')

//     // get the bear with that id (accessed at GET http://localhost:8080/api/bears/:bear_id)
//     .get(function(req, res){
//         Bear
//           .find(req.params.bear_id)
//           .complete(function(err, bears) {
//             if (!!err)
//               res.send(err);

//             res.json(bears);
//           });
//     })

//     // update the bear with this id (accessed at PUT http://localhost:8080/api/bears/:bear_id)
//     .put(function(req, res){

//         Bear
//           .find(req.params.bear_id)
//           .complete(function(err, bear) {
            
//             bear.name = req.body.name;

//             bear
//               .save()
//               .complete(function(err) {
//                 if (!!err) 
//                     res.send(err);
//                 res.json({ message: 'Bear updated!' });
//               })
//           });
//     })

    // .delete(function(req, res){
    //     Bear
    //         .find(req.params.bear_id)
    //         .complete(function(err, bear){
    //             bear.destroy().success(function(err){
    //                 if (!!err)
    //                     res.send(err);
    //                 res.json({ message: 'I can\'t believe you killed bear!' });
    //             });
    //         });
    // });

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Strike back on port ' + port);
