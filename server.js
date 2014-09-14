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
    , http          = require('http');

app.set('views', path.join(__dirname, '/app'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, '/app')));

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

db
  .sequelize
  // .sync({force: true});
  .sync();

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

router.route('/register')
  .post(function(req, res){

    // Needs to take User model (username at least, but other attrs if user is new), and CampaignId

    // Check if UserId came down.
    db.User.findOrCreate({ username: req.body.user.username }, {
      // Create user if this is a new user
      username: req.body.user.username,
      password: req.body.user.password,
      phone: req.body.user.phone || null,
      email: req.body.user.email || null
      })
      .success(function(user, created){

        // Register user to this campaign
        // Get the campaign
        // (Do I really need to grab the whole campaign? Can't I just use the campaginId?)
        // (Maybe I can define my own relationship setter that takes an optional userId and campaignId)
        db.Campaign.find({ id:req.body.campaign.id }).complete(function(err, campaign){
          // Register user to campaign
          user.addRegistration(campaign)
          .success(function(campaign){

            // Return list of user's registrations
            user.getRegistrations()
              .success(function(registrations){
                res.send(registrations);
              })
          })
        })
      });
  })

  // Get all registrations for particular campaign
  // Returns list of users who have registered to this campaign
  .get(function(req, res) {
    db.Campaign.find({ where: { id: req.query.campaign_id } } )
      .success(function(campaign){
        campaign.getRegistrations()
          .success(function(registrations){
            res.send(registrations);
          })
      })
  });


router.route('/campaigns')
  // Send name, target, callToAction plus userId
  .post(function(req, res){


      // Check if username is in the DB system (all usernames are unique by default because only one person can have the given phone number or email address)

      // Verify that the owner exists. If the owner doesn't exist, create it
      db.User.findOrCreate(
        { username: req.body.user.username },
        {
          password: req.body.user.password,
          email: req.body.user.email || null,
          phone: req.body.user.phone || null
        })
        .success(function(owner, created){
                // Once we have our campaign owner, create the campaign and associate the owner
                db.Campaign.create({
                  name: req.body.campaign.name,
                  target: req.body.campaign.target,
                  callToAction: req.body.campaign.callToAction
                })
                .success(function(campaign){
                    // addOwner(), a method magically created by Sequelizer, will insert objects into the DB as owners of this campaign
                    campaign.addOwner(owner).success(function(campaignOwner){
                      campaignOwner.getOwns().success(function(owns){
                        // getOwns(), a method magically created by Sequelizer, gets all campaigns owned by this user and returns it as the 'owns'
                        res.send(owns);
                      })
                    })
                });
        });
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
            .complete(function(err, campaign) {
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
      
      // console.log(req);

      var user = db.User.build({
        username: req.body.username,
        password: req.body.password,
        phone: req.body.phone,
        email: req.body.email
      });
       
      user
        .save()
        .complete(function(err, user) {
          if (!!err) 
              res.send(err);
          res.json(user);
        });
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
            .complete(function(err, user) {
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