// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express         = require('express')
    , app           = express()
    , bodyParser    = require('body-parser')
    , db            = require('./models')
    , port          = process.env.PORT || 80
    , path          = require('path')
    , http          = require('http')
    , passport      = require('passport')
    , flash         = require('connect-flash')
    , cookieParser  = require('cookie-parser')
    , bodyParser    = require('body-parser')
    , session       = require('express-session');
    // , expressJwt    = require('express-jwt')
    // , jwt           = require('jsonwebtoken');

app.set('views', path.join(__dirname, '/app'));
app.set('view engine', 'ejs');

app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

// required for passport
// app.use( express.cookieParser() );
app.use(session({ secret: 'iTt5sti1meT0f1ghtTth3ep0wer'})); // session secret
// app.use(session({ secret: 'iTt5sti1meT0f1ghtTth3ep0wer', cookie: { secure: false } })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
// app.use(flash()); // use connect-flash for flash messages stored in session


// ROUTES FOR OUR API
// =============================================================================
require('./router/routes.js')(express, app, db, passport); // load our routes and pass in our app and fully configured passport

app.use(express.static(path.join(__dirname, '/app')));

// configure app to use bodyParser()
// this will let us get the data from a POST
// app.use(bodyParser.urlencoded({ extended: true }))
// app.use(bodyParser.json())


// Connect to DB =====================================
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

require('./config/passport')(passport); // pass passport for configuration

// Render our default index.js page when a person first navigates to this url
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