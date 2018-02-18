const util = require('util');
const path = require('path');
const assert = require('assert');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const MongoClient = require('mongodb').MongoClient;
const async = require('async');

const config = require("./config");
const climbing = require("./climbing.config");
var db = require("./mongodb");

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

passport.use('google', new GoogleStrategy({
    clientID: config.google.client_id,
    clientSecret: config.google.client_secret,
    callbackURL: config.google.redirect_uris[0]
  },
  function(accessToken, refreshToken, profile, done) {
    //console.dir(profile, {depth: null, showHidden: true});
    db.users().getByID(profile.id, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        let new_user = {
          id: profile.id,
          displayName: profile.displayName,
          email: profile.emails[0] ? profile.emails[0].value : null,
          picture: profile.photos[0] ? profile.photos[0].value : null,
          gender: profile.gender,
          birthdate: profile._json.birthday,
          provider: 'Google',
          revoke_app_url: 'https://myaccount.google.com/permissions',
          lang: profile._json && profile._json.language || 'fr',
          is_admin: true,
        };
        db.users().insert(new_user, function(err2, inserted) {
          if (err2) {
            return done(err2);
          }
          return done(null, profile);
        });
      } else {
        // update ! check etag
        return done(null, user);
      }
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  db.users().getByID(id, function(err, user) {
    if (err) {
      console.error(err);
      return done(err, false);
    }
    done(null, user);
  });
});

app.get('/auth/google',
  passport.authenticate('google', { scope: [
      //'profile',
      'email',
      'https://www.googleapis.com/auth/plus.login'
      //'https://www.googleapis.com/auth/plus.login'
    ]
  }
));

app.get('/auth/google/callback',
  passport.authenticate('google', {
          successRedirect : '/',
          failureRedirect : '/failedgoogleauth'
}));

app.get('/auth/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
      return next();

  // if they aren't redirect them to the home page
  res.status(401).send({result:'error', error: {message:'not authenticated'}});
}

app.get('/auth/userinfo', isLoggedIn, function(req, res) {
    if (!req.user) {
      return res.send({result:'error', error: {message:'no session'}});
    } else {
      res.send({result:'ok', data: {
            displayName: req.user.displayName,
            picture: req.user.picture,
            is_admin: true,//req.user.is_admin,
          }
      });
    }
});

app.get('/test', function(req, res) {
  res.send({result: 'ok'});
});


app.get('/walls', function(req, res) {
  res.send({result: 'ok', data: climbing.walls});
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
  console.log("serving static from " + __dirname);
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
