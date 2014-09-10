// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express         = require('express')
    , app           = express()
    , routes        = require('./routes')
    , bodyParser    = require('body-parser')
    , db            = require('./models')
    , port          = process.env.PORT || 80
    , path          = require('path')
    , http          = require('http')

app.set('views', path.join(__dirname, '/app'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, '/app')));

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// db
//   .sequelize
//   .sync({ force: true })

db
  .sequelize
  .authenticate()
  .complete(function(err){
      if (!!err) {
          console.log('Unable to connect to database:', err)
      } else {
          console.log('Connection has been established successfully.')
      }
  });


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
	res.json({ message: 'Strike back!' });	
});

// more routes for our API will happen here

// router.route('/cause')

//     // Get a specific cause
//     .get(function(req, res){

//     })

//     // Create a cause
//     .post(function(req, res){

//     })

//     // Edit a cause
//     .put(function(req, res){

//     })

//     // Delete a cause
//     .delete(function(req, res){

//     });

// router.route('/user')

//     // Get a specific user
//     .get(function(req, res){

//     })

//     // Create a user
//     .post(function(req, res){

//     })

//     // Edit a user
//     .put(function(req, res){

//     })

//     // Delete a user
//     .delete(function(req, res){

//     });

// router.route('/cause/register')

//     // Get list of registered users
//     .get(function(req, res){

//     })

//     // Add user to a cause
//     .post(function(req, res){

//     })

//     // Delete user from a cause
//     .delete(function(req, res){

//     });

router.route('/register')
  .post(function(req, res){

      // Need to figure out a way to get userId and campaignId. I'll need to check whether the user sent up has an Id, and if not, register the user.

      // At this moment, there's no way to have a user send up their userId, so just first create that user and then use the userId from that. I still need to send up the campaign model (or at least the Id) during the save.

      var registration = db.Registrations.build({
        campaignId: req.body.campaignId,
        userId: req.body.userId
      })

      registration
        .save()
        .complete(function(err) {
          if (!!err)
              res.send(err);
          res.json({ message: 'User registered to campaign'});
        })
  });

// router.route('/cause/:cause_id')
router.route('/campaigns')
  .post(function(req, res){
        var campaign = db.Campaign.build({
          name: req.body.name,
          target: req.body.target,
          callToAction: req.body.callToAction
        })
         
        campaign
          .save()
          .complete(function(err) {
            if (!!err) 
                res.send(err);
            res.json(campaign);
          })
    })

  .get(function(req, res){
      db.Campaign
        .findAll()
        .complete(function(err, campaigns) {
          if (!!err)
            res.send(err);

          res.json(campaigns);
        })
  });

router.route('/campaigns/:campaign_id')
  .get(function(req, res){
      db.Campaign
        .find(req.params.campaign_id)
        .complete(function(err, campaign) {
          if (!!err)
            res.send(err);

          res.json(campaign);
        });
  })

  // update the bear with this id (accessed at PUT http://localhost:8080/api/bears/:bear_id)
  .put(function(req, res){

      db.Campaign
        .find(req.params.campaign_id)
        .complete(function(err, campaign) {
          
          campaign.name = req.body.name;
          campaign.target = req.body.target;
          campaign.callToAction = req.body.callToAction;

          campaign
            .save()
            .complete(function(err) {
              if (!!err) 
                  res.send(err);
              res.json(campaign);
            })
        });
  })

  .delete(function(req, res){
      db.Campaign
          .find(req.params.campaign_id)
          .complete(function(err, campaign){
              campaign.destroy().success(function(err){
                  if (!!err)
                      res.send(err);
                  res.json({ message: 'Campaign removed' });
              });
          });
  });

// on routes that end in /users
router.route('/users')
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
          res.json(user);
        })
  })

  .get(function(req, res){
      db.User
        .findAll()
        .complete(function(err, users) {
          if (!!err)
            res.send(err);

          res.json(users);
        })
  });

router.route('/users/:user_id')
  .get(function(req, res){
      db.User
        .find(req.params.user_id)
        .complete(function(err, users) {
          if (!!err)
            res.send(err);

          res.json(users);
        });
  })

  // update the bear with this id (accessed at PUT http://localhost:8080/api/bears/:bear_id)
  .put(function(req, res){

      db.User
        .find(req.params.user_id)
        .complete(function(err, user) {
          
          user.username = req.body.username;
          user.password = req.body.password;
          user.phone = req.body.phone;
          user.email = req.body.email;

          user
            .save()
            .complete(function(err) {
              if (!!err) 
                  res.send(err);
              res.json(user);
            })
        });
  })

  .delete(function(req, res){
      db.User
          .find(req.params.user_id)
          .complete(function(err, user){
              user.destroy().success(function(err){
                  if (!!err)
                      res.send(err);
                  res.json({ message: 'User removed' });
              });
          });
  });

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

app.use(function(req, res, next) {
    // if (req.url.indexOf(".") >= 0)
    if (req.url.indexOf(".") >= 0) {
        next();
        return;
    }
    res.render('index');
});

// START THE SERVER
// =============================================================================
// app.listen(port);
// console.log('Strike back on port ' + port);

http.createServer(app).listen(port, function () {
    console.log('Express server listening on port ' + port);
});