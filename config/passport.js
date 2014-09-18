// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;
// var HttpStrategy    = require('passport-http');

// expose this function to our app using module.exports
module.exports = function(passport, db) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        db.User
          .find({ where: { id: id } })
          .complete(function(err, user){
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) {

        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {

            // find a user whose username is the same as the body username
            // we are checking to see if the user trying to login already exists
            db.User.find({ where :{ username: username } }).complete(function(err, user){
                // if there are any errors, return the error
                if (err)
                    return done(err);

                // check to see if theres already a user with that email
                if (user) {
                    // return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                    // return done(null, false, {'message': 'That email is already taken.'});
                    return done(null, false, {'message': 'That email is already taken.'});
                } else {

                    // if there is no user with that email
                    // create the user
                    db.User
                      .create({
                        username: username,
                        password: password
                      })
                      .success(function(user){
                        return done(null, user, {'message': 'Success! You\'re in.' });
                      })
                      .error(function(err){
                        return done(err);
                      });
                }
            });
        });
    }));

// =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) { // callback with email and password from our form

        // find a user whose username is the same as the sent username
        // we are checking to see if the user trying to login already exists
        db.User.find({ where :{ username: username } }).complete(function(err, user){
            // if there are any errors, return the error
            if (err)
                return done(err);


            // if no user is found, return the message
            if (!user)
                // res.send(401)
                return done(null, false, {'message': 'No user found.'}); // req.flash is the way to set flashdata using connect-flash

                console.log(user.verifyPassword(password));

            // if the user is found but the password is wrong
            if (!user.verifyPassword(password)) return done(null, false, {'message': 'Oops! Wrong password.'}); // create the loginMessage and save it to 
                // res.send(401)
                // session as flashdata

            // all is well, return successful user
            // res.send(200)
            return done(null, user);
        });

    }));

};