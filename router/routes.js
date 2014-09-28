    var jwt                             = require('jwt-simple')
    , moment                            = require('moment')
    , _                                 = require('underscore')
    , async                             = require('async')
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
    /**
     *  expects...
        "campaign" : {
          "id" : (num)
        }
     */
    .post(checkTokenOrFindUserOrCreateUser, function(req, res){

      // One of these two are returned by checkTokenOrFindUserOrCreateUser
        if (!_.isUndefined(req.user)) {
          var user = req.user
        } else if (!_.isUndefined(req.token) && !_.isUndefined(req.token.user)) {
          var user = req.token.user;
        }

        // If no campaign id, complain
        if (_.isUndefined(req.body.campaign.id)) res.send({success: false, message: "Must include a campaign id in this form: 'campaign': { 'id': (num) }"});

      // Register user to this campaign
      // Get the campaign
      // (Do I really need to grab the whole campaign? Can't I just use the campaginId?)
      // (Maybe I can define my own relationship setter that takes an optional userId and campaignId)
      db.Campaign.find({ where: { id: req.body.campaign.id } }).complete(function(err, campaign){
        // Register user to campaign
        user.addRegistration(campaign)
        .success(function(campaign){

          // Return list of user's registrations
          user.getRegistrations()
            .success(function(registrations){
              // obj = user.addUserTokenToResponse({ registrations: registrations }, req);
              user.dataValues.campaignsJoined = registrations;
              user.selectedValues.campaignsJoined = registrations;
              // If a token was generated, send it back as a property 'token' on the user obj
              if (!_.isUndefined(req.token)) {
                req.token.user = user.id;
                user.selectedValues.token = req.token;
                user.dataValues.token = req.token;
              }

              res.send(user);
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

    /**
     *  expects...
        "campaign": {
          "name":         (string),
          "callToAction": (string),
          "target":       (BIGINT)
        }
      */
    .post(checkTokenOrFindUserOrCreateUser, function(req, res){
        if (!_.isUndefined(req.user)) {
          var user = req.user
        } else if (!_.isUndefined(req.token) && !_.isUndefined(req.token.user)) {
          var user = req.token.user;
        }

      if (_.isUndefined(user)) res.send({success:false, message: "You must include either a user token or user credentials (username and pass)."});

      if (
          _.isUndefined(req.body.campaign)
          || _.isUndefined(req.body.campaign.name)
          || _.isUndefined(req.body.campaign.target)
          || _.isUndefined(req.body.campaign.callToAction)
      ) {
        res.send({success:false, message: "You must include a campaign object in the request body: { campaign: { name: (string), callToAction: (string), target: (BIGINT) } }."});
      }

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
              // getOwns(), a method magically created by Sequelizer, gets all campaigns owned by this user and returns it as the 'owns' obj

              // The owns obj should be a property of the user obj
              user.selectedValues.campaignsOwned = owns;
              user.dataValues.campaignsOwned = owns;
              // If a token was generated, send it back as a property 'token' on the user obj
              if (!_.isUndefined(req.token)) {
                req.token.user = user.id;
                user.selectedValues.token = req.token;
                user.dataValues.token = req.token;
              }
              res.send(user);
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
    //    campaign_ids =   :campaign_id
    .get(checkTokenOrFindUser, function(req, res){
        if (!_.isUndefined(req.user)) {
          var user = req.user
        } else if (!_.isUndefined(req.token) && !_.isUndefined(req.token.user)) {
          var user = req.token.user;
        }

        // Turn campaign_ids into an array
         var campaign_ids = (!_.isUndefined(req.query.campaign_ids)) ? req.query.campaign_ids.split(",") : null;


        // Get a user's campaigns with the given Id
        if (!_.isUndefined(user)) {
          if (!_.isUndefined(req.query) && !_.isNull(campaign_ids)) {
            // If we've got a :campaign_id, use it to select specific campaign(s)
            user
              .findAll({ where: { id: campaign_ids } })
              .complete(function(err, campaigns) {
                  if (!!err)
                  res.send(err);

                res.json(campaigns);
              })
          }

        } else if( !_.isUndefined(req.query) && !_.isNull(campaign_ids) ) {
          db.Campaign
            .findAll({ where: {id: campaign_ids} })
            .complete(function(err, campaigns) {
              if (!!err)
                res.send(err);

              // res.json({campaigns: campaigns});
              res.send({campaigns: campaigns});
            });
        } else if (!_.isUndefined(req.query) && !_.isUndefined(req.query.getAll) && req.query.getAll === "true"){
          // Else get all the campaigns (LIMIT 20)
          var limit = req.query.limit || 20;

          db.Campaign
            .findAll({ limit: limit })
            .complete(function(err, campaigns) {
              if (!!err)
                res.send(err);

              // res.json({campaigns: campaigns});
              res.send({campaigns: new Array()});
            });
        } else {
          res.json({success: false, message: "Must include query params: getAll (true|false) and limit (defaults to 20), or a campaign_id."});
        }
    });

  /**
    *  expects...
      {
        username:   (phone|email),
        password:   (string),
        telephone:  (string),
        email:      (string)  
      }
    */
  router.route('/users')
    .post(function(req, res, next){

      // Set defaults
      // (Should send res error if certain fields aren't present, like if username is 'email' but there's no 'email' present)
      email = req.body.email,
      phone = req.body.phone,
      username = req.body.username,
      password = req.body.password;


      db.User.find({ where : ['email=? or phone=? ', email, phone] }).complete(function(err, user){
          // if there are any errors, return the error
          if (err)
              return next(err);

          // check to see if theres already a user with that email
          if (user) {
              // return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
              // return done(null, false, {'message': 'That email is already taken.'});
              return res.status(401).send({ success : false, message : 'Either your email address or telephone are already registered.' });
          } else {
              // if there is no user with that email
              // create the user
              db.User
                .create({
                  username: req,
                  password: password,
                  phone: phone || null,
                  email: email || null
                })
                .success(function(user){
                  // return done(null, user, {'message': 'Success! You\'re in.' });
                    var expires = moment().add('days', 7).valueOf();
                    var token = jwt.encode({
                      iss: user.id,
                      exp: expires
                    }, app.get('jwtTokenSecret'));
                     
                    // This sends the token, expires and user info
                    res.json({
                      token : token,
                      expires: expires,
                      user: user
                    });
                })
                .error(function(err){
                  return res.send(err);
              });
          }
      });


      // passport.authenticate('local-signup', function(err, user, info) {
      //   if (err) {
      //     return next(err); // will generate a 500 error
      //   }
        
      //   if (! user) {
      //     return res.status(401).send({ success : false, message : info.message });
      //   }
          
      //   var expires = moment().add('days', 7).valueOf();
      //   var token = jwt.encode({
      //     iss: user.id,
      //     exp: expires
      //   }, app.get('jwtTokenSecret'));
         
      //   // This sends the token, expires and user info
      //   res.json({
      //     token : token,
      //     expires: expires,
      //     user: user.toJSON()
      //   });

      // })(req, res, next)
    })

    // User gets info about themselves from login or token
    // This supplies getOwns() and getRegistrations() info about the user
    // 
    // Query parameters:
    //    getOwns = true|false
    //    getRegistrations = true|false
    // 
    .get(checkTokenOrFindUser, function(req, res){
        if (!_.isUndefined(req.user)) {
          var user = req.user
        } else if (!_.isUndefined(req.token) && !_.isUndefined(req.token.user)) {
          var user = req.token.user;
        }

      if (user) {

        // Array to hold async tasks
        var asyncTasks = [];

        // If user requests to get the campaigns owned, include them
        asyncTasks.push(function(callback){
          if (req.query.getOwns === "true"){
            user.getOwns().success(function(campaignsOwned){
              user.selectedValues.campaignOwned = campaignsOwned;
              user.dataValues.campaignOwned = campaignsOwned;

              callback();
            });
          } else {
            callback();
          }
        });
        
        // If user requests to get the campaigns joined, include them
        asyncTasks.push(function(callback){
          if (req.query.getRegistrations === "true"){
            user.getRegistrations().success(function(campaignsJoined){
              user.selectedValues.campaignsJoined = campaignsJoined;
              user.dataValues.campaignsJoined = campaignsJoined;
              
              callback();
            });
          } else {
            callback();
          }
        });
        
        // Now we have an array of functions doing async tasks
        // Execute all async tasks in the asyncTasks array
        async.parallel(asyncTasks, function(){
          // All tasks are done now, so send back user
          res.send(user);
        });

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