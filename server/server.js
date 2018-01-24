const util = require('util');
const path = require('path');
const assert = require('assert');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const MongoClient = require('mongodb').MongoClient;
const async = require('async');

const config = require("./config");


var db = null;
var Users = null;
MongoClient.connect(config.mongo_url, function(err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to MongoDB server");

  db = client.db(config.dbName);
  Users = db.collection('Users');
  //client.close();
});

const isDeveloping = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 3000;
const app = express();

app.use(session({ 
  secret: config.session_secret,
  resave: true,
  saveUninitialized: true,
  httpOnly: false
}));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
passport.use('signin', new LocalStrategy(
  function(username, password, done) {
    Users.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      bcrypt.compare(password, user.passwordHash, function (err, isValid) {
        if (err) {
          return done(err);
        }
        if (!isValid) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      });
    });
  }
));

passport.use('google', new GoogleStrategy({
    clientID: config.google.client_id,
    clientSecret: config.google.client_secret,
    callbackURL: config.google.redirect_uris[0]
  },
  function(accessToken, refreshToken, profile, done) {
    //console.log(profile);
    
    Users.findOne({ id: profile.id }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        Users.insert(profile, function(err, inserted) {
          return done(null, profile);
        });
      } else {
        // update !
        return done(null, user);
      }
    });
    
    //return done(null, false, { message: 'Not just yet.' });
  }
));

passport.serializeUser(function(user, done) {
  console.log('serializeUser '+user.id);
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  console.log('deserializeUser ' + id);
  Users.findOne({ id: id }, function(err, user) {
    if (err) {
      console.error(err);
      return done(err, false);
    }
    console.log(user.displayName);
    done(null, user);
  });
});

app.post('/auth/signin', function(req, res, next) {
  console.log("signing in "+req.body.username);
  passport.authenticate('signin', function(err, user, info) {
    if (err) { return res.send({result: 'error', error: {message: err}}); }
    if (!user) { return res.send({result: 'error', error: info}); }
    req.logIn(user, function(err) {
      if (err) { return res.send({result: 'error', error: err}); }
      return res.send({result: 'ok', user: user})
    });
  })(req, res, next);
});

app.post('/auth/signup', function(req, res, next) {
  
  res.send({result: 'error', error: {message: "not implemented"}});
});

app.get('/auth/google',
  passport.authenticate('google', { scope: [
      'profile',
      'email'
      //'https://www.googleapis.com/auth/plus.login'
    ]
  }
));

app.get('/auth/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

/*
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/googleloginfailed' }), function(req, res) {
    res.redirect('/');
});
*/
app.get('/auth/google/callback',
  passport.authenticate('google', {
          successRedirect : '/',
          failureRedirect : '/failedgoogleauth'
  }));

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
  console.log(req.session);
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
      return next();

  // if they aren't redirect them to the home page
  res.redirect('/');
}

function sessionAuth(req, res, next) {
  return passport.authenticate('session')(req, res, next);
}

app.get('/auth/userinfo', isLoggedIn, function(req, res) {
    if (!req.user) {
      return res.send({result:'error', error: {message:'no session'}});
    } else {
      res.send({result:'ok', data: {displayName:req.user.displayName} });
    }
});

app.get('/test', function(req, res) {
  console.log(req.user.displayName);
  res.send({result: 'ok'})
});


/*
if (isDeveloping) {
  let webpack = require('webpack'),
    webpackConfig = require('./webpack.dev.config.js'),
    compiler = webpack(webpackConfig);

  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath
  }));

  app.use(require('webpack-hot-middleware')(compiler));
} else {
*/
  console.log("serving static from " + __dirname)
  app.use(express.static(path.join(__dirname, '../dist')));
  app.get('/', function response(req, res) {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
//}


app.listen(port, '0.0.0.0', function onStart(err) {
  if (err) {
    console.log(err);
  }
  console.info('==> Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.', port, port);
});
