    var jwt                             = require('jwt-simple')
    , moment                            = require('moment')
    , _                                 = require('underscore')
    , jwtauth                           = require('../config/jwtAuth.js')
    , checkTokenOrFindUserOrCreateUser  = require('../config/checkTokenOrFindUserOrCreateUser.js')
    , checkTokenOrFindUser              = require('../config/checkTokenOrFindUser.js')

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
    .post(checkTokenOrFindUserOrCreateUser, function(req, res){

      // One of these two are returned by checkTokenOrFindUserOrCreateUser
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
    })

    // Get all registrations for particular campaign
    // Returns list of users who have registered to this campaign
    // req.query = { campaign_id }
    .get(checkTokenOrFindUserOrCreateUser, function(req, res) {

      // One of these two are returned by checkTokenOrFindUserOrCreateUser
      var user = req.user || req.token.user;
      if (!_.isString(req.query.campaign_id)) {
        res.send({success: false, message: "You must include campaign_id as a query parameter"});
      }

      // Check if campaign is owned by user
      // Pshhh will I have to create my own getOwns() func that accepts a campaign_id?
      user.getOwns({ where: {id: req.query.campaign_id} })
        .success(function(campaign){
          // If found, return list of users
          if (!_.isEmpty(campaign)) {
            // Might have to re-hanlde this part to deal with the fact that the campaigns are returned in an array
            campaign[0].getRegistrations()
              .success(function(registrations){
                res.send(registrations);
              })
          } else {
            // Else say, "You don't own such-and-such :campaign_id"
            res.send({success: false, message: "Either campaign " + req.query.campaign_id + " doesn't exist or you do not own it."});            
          }
        })
        .error(function(campaign){
          // 
        })

      // db.Campaign.find({ where: { id: req.query.campaign_id } } )
      //   .success(function(campaign){
      //     campaign.getRegistrations()
      //       .success(function(registrations){
      //         res.send(registrations);
      //       })
      //   })
    });


  router.route('/campaigns')
    // Send name, target, callToAction plus user token/creds
    .post(checkTokenOrFindUserOrCreateUser, function(req, res){

      var user = req.user || req.token.user;

      if (_.isUndefined(req.campaign.name) || _.isUndefined(req.campaign.target) || _.isUndefined(req.campaign.callToAction)) res.send({success:false, message: "You must include each: the campaign name, target, and call to action."});

      // Once we have our campaign owner, create the campaign and associate the owner
      db.Campaign.create({
        name: req.body.campaign.name,
        target: req.body.campaign.target,
        callToAction: req.body.campaign.callToAction
      })
      .success(function(campaign){
          // addOwner(), a method magically created by Sequelizer, will insert objects into the DB as owners of this campaign
          campaign.addOwner(user).success(function(campaignOwner){
            campaignOwner.getOwns().success(function(owns){
              // getOwns(), a method magically created by Sequelizer, gets all campaigns owned by this user and returns it as the 'owns'
              res.send(owns);
            })
          })
      });

    })


    // Update campaign using dashboard
    // Requires user token or user credentials
    .put(checkTokenOrFindUser, function(req, res){
      var user = req.user || req.token.user;

      user.getOwns({ where: { id: req.body.campaign.id } })
        .complete(function(err, campaign) {
          
          campaign[0].name = req.body.campaign.name;
          campaign[0].target = req.body.campaign.target;
          campaign[0].callToAction = req.body.campaign.callToAction;

          campaign[0]
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
    .delete(checkTokenOrFindUser, function(req, res){
      var user = req.user || req.token.user;

      user.getOwns({ where: { id: req.body.campaign.id } })
        .complete(function(err, campaign){
            campaign[0].destroy().success(function(err){
                if (!!err)
                    res.send(err);
                res.json({ message: 'Campaign removed' });
            });
        });

      // db.Campaign
      //     .find(req.body.campaign.id)
      //     .complete(function(err, campaign){
      //         campaign.destroy().success(function(err){
      //             if (!!err)
      //                 res.send(err);
      //             res.json({ message: 'Campaign removed' });
      //         });
      //     });
    })

    // Get list of campaigns for homepage or get campaign for dashboard
    // Query parameters:
    //    getAll      =   true|false
    //    limit       =   num, default (20)
    //    campaign_id =   :campaign_id
    .get(checkTokenOrFindUser, function(req, res){
        var user = req.user || req.token.user;

        if (user && req.query && req.query.campaign_id) {
          // If we've got a :campaign_id, use it to select specific campaign(s)
          user
            .find({ where: { id: req.query.campaign_id } })
            .complete(function(err, campaigns) {
                if (!!err)
                res.send(err);

              res.json(campaigns);
            })

        } else if (req.query && req.query.getAll){
          // Else get all the campaigns (LIMIT 20)
          var limit = req.query.limit || 20;

          db.Campaign
            .findAll({ limit: limit })
            .complete(function(err, campaigns) {
              if (!!err)
                res.send(err);

              res.json(campaigns);
            })
        }
    });

  // on routes that end in /users
  router.route('/users')
    .post(function(req, res){
        var user = db.User.build({
          username: req,
          phone: req.body.phone || null,
          email: req.body.email || null,
          password: req.body.password
        });

        user
          .save()
          .complete(function(err, user) {
            if (!!err) 
                res.send(err);
            obj = user.addUserTokenToResponse({}, req);
            res.json(user);
          });
    })

    // User gets info about themselves from login or token
    // This supplies getOwns() and getRegistrations() info about the user
    // 
    // Query parameters:
    //    getOwns = true|false
    //    getRegistrations = true|false
    // 
    .get(checkTokenOrFindUser, function(req, res){
      var user = req.user || req.token.user;

      if (user) {

        // If user requests to get the campaigns owned, include them
        if (req.query.getOwns){
          user.getOwns().success(function(campaignsOwned){
            user.owns = campaignsOwned;
          });
        }
        
        // If user requests to get the campaigns joined, include them
        if (req.query.getRegistrations){
          user.getRegistrations().success(function(campaignsJoined){
            user.joined = campaignsJoined;
          });
        }
        
        res.send(user);

      } else {
        res.send({success: false, message: "checkTokenOrFindUser failed to return a user."});
      }
    })

    
    .put(checkTokenOrFindUser, function(req, res){
      var user = req.user || req.token.user;

        db.User
          .find({ where: { id: user.id } })
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

    .delete(checkTokenOrFindUser, function(req, res){
      var user = req.user || req.token.user;
        db.User
            .find({ where: { id: user.id } })
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