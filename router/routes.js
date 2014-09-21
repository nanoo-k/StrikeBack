    var jwt                           = require('jwt-simple')
    , moment                          = require('moment')
    , jwtauth                         = require('../config/jwtAuth.js')
    , checkTokenThenFindOrCreateUser  = require('../config/checkTokenThenFindOrCreateUser.js');

// router/routes.js
module.exports = function(express, app, db, passport) {
  var router = express.Router();        // get an instance of the express Router

  // test route to make sure everything is working (accessed at GET http://localhost:8080/api)
  router.get('/', function(req, res) {
    res.json({ message: 'Strike back!' });  
  });

  // router.route('/checktoken')
  //   .get(jwtauth, requireAuth, function(req, res, next){
  //     res.send(req.user);
  //   });

  // Exchange user credentials for a token
  // Takes username and unhashed password
  router.route('/token')
    .post(function(req, res, next) {
      passport.authenticate('local-login', function(err, user, info) {
          if (err) {
            return next(err); // will generate a 500 error
          }
          
          if (! user) {
            return res.status(401).send({ success : false, message : info.message });
          }
            
          var expires = moment().add('days', 7).valueOf();
          var token = jwt.encode({
            iss: user.id,
            exp: expires
          }, app.get('jwtTokenSecret'));
           
          // This sends the token, expires and user info
          res.json({
            token : token,
            expires: expires,
            user: user.toJSON()
          });

      })(req, res, next)
    });

    // .get(function(req, res, next) {
    //   passport.authenticate('local-signup', function(err, user, info) {
    //       if (err) {
    //         return next(err); // will generate a 500 error
    //       }
    //       // Generate a JSON response reflecting authentication status
    //       if (! user) {
    //         return res.send({ success : false, message : info.message });
    //       }
    //       return res.send({ success : true, message : info.message, user: user });
    //   })(req, res, next)
    // });

  // Register a user to a campaign
  router.route('/register')
    .post(checkTokenThenFindOrCreateUser, function(req, res){

      // One of these two are returned by checkTokenThenFindOrCreateUser
      var user = req.user || req.token.user;

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
              obj = user.addUserTokenToResponse({ registrations: registrations }, req);
              res.send(obj);
            })
            .error(function(err){
              res.send(err);
            })
        })
      })

      // Ran this thru middle that checks for token, checks for existing user, and creates user if not existing

      // Needs to take User model (username at least, but other attrs if user is new), and CampaignId

      // Check if UserId came down.
      // db.User.findOrCreate({ username: req.body.user.username }, {
      //   // Create user if this is a new user
      //   username: req.body.user.username,
      //   password: req.body.user.password,
      //   phone: req.body.user.phone || null,
      //   email: req.body.user.email || null
      //   })
      //   .success(function(user, created){

      //     // Register user to this campaign
      //     // Get the campaign
      //     // (Do I really need to grab the whole campaign? Can't I just use the campaginId?)
      //     // (Maybe I can define my own relationship setter that takes an optional userId and campaignId)
      //     db.Campaign.find({ id:req.body.campaign.id }).complete(function(err, campaign){
      //       // Register user to campaign
      //       user.addRegistration(campaign)
      //       .success(function(campaign){

      //         // Return list of user's registrations
      //         user.getRegistrations()
      //           .success(function(registrations){
      //             res.send(registrations);
      //           })
      //       })
      //     })
      //   });
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
        req.query
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

    // Update campaign using dashboard
    // Requires user token or user credentials
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

    // Delete campaign
    // Requires user token or user credentials
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
          username: req,
          phone: req.body.phone,
          email: req.body.email,
          password: req.body.password
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

  // middleware to use for all requests
  router.use(function(req, res, next) {
  //    do logging
      console.log('Something is happening.');
      next();
  });

  /**
  * A simple middleware to restrict access to authenticated users.
  */
  var requireAuth = function(req, res, next) {
    if (!req.user) {
      res.end('Not authorized', 401)
    } else {
      next()
    }
  }
}


// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on 
  if (req.isAuthenticated())
    return next();

  // if they aren't redirect them to the home page
  res.redirect('/');
}
