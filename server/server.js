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

app.get('/grades', function(req, res) {
  res.send({result: 'ok', data: climbing.grades});
});

app.get('/routes/:wall_id', isLoggedIn, function(req, res) {
  db.routes().getAllActiveByWallID(Number(req.params.wall_id), function(err, routes) {
    if (err) {
      res.send({result: 'error', error: err});
    } else {
      async.forEachOf(routes, function(r, key, next) {
        db.passed().getByID(r._id, req.user.id, function(err2, p) {
          if (err2) return next(err2);
          routes[key].passed = p;
          return next();
        });
        
        
      }, function(err) {
      // if any of the file processing produced an error, err would equal that error
      if( err ) {
        // One of the iterations produced an error.
        // All processing will now stop.
        res.send({result: 'error', error: err});
      } else {
        res.send({result: 'ok', data: routes});
      }
    });
      
    }
  });
});

app.post('/routes/add', isLoggedIn, function(req, res) {
  let new_route = req.body;
  new_route.date_closed = null;
  new_route.closed_by = "";
  db.routes().insert(new_route, function(err) {
    if (err) {
      res.send({result: 'error', error: err});
    } else {
      res.send({result: 'ok', data: "route added"});
    }
  });
});

app.post('/routes/close', isLoggedIn, function(req, res) {
  let route_id = req.body.route;
  db.routes().close(route_id, new Date(), req.user.displayName, function(err) {
    if (err) {
      res.send({result: 'error', error: err});
    } else {
      res.send({result: 'ok', data: "route closed"});
    }
  });
});

app.post('/routes/pass', isLoggedIn, function(req, res) {
  let route_id = req.body.route;
  let passed = req.body.passed;
  if (passed) {
    db.passed().insert(route_id, req.user.id, function(err) {
      if (err) {
        res.send({result: 'error', error: err});
      } else {
        res.send({result: 'ok', data: "route marked as passed"});
      }
    });
  } else {
    db.passed().remove(route_id, req.user.id, function(err) {
      if (err) {
        res.send({result: 'error', error: err});
      } else {
        res.send({result: 'ok', data: "undo route marked as passed"});
      }
    });
  }
});

var computeRank = (routes) => (user, next) => {
  return next(null, {
            id: user.id,
            displayName: user.displayName,
            picture: user.picture,
            points: 1,
            category: "Moule",
          });
}

app.get('/ranking', function(req, res) {
  /*
    id
    displayName
    points
    category
  */
  async.parallel([
    function(callback) {
        db.routes().getAllActive(function(err, routes) {
          if (err) return callback(err);
          return callback(null, routes);
        });
    },
    function(callback) {
        db.users().getAll(function(err, users) {
          if (err) return callback(err);
          return callback(null, users);
        });
    }
  ],
  // optional callback
  function(err, results) {
      // the results array will equal ['one','two'] even though
      // the second function had a shorter timeout.
      if (err) {
        res.send({result: 'error', error: err});
      } else {
        const routes = results[0];
        const users = results[1];
        
        async.map(users, computeRank(routes), function(err, ranking) {
          if (err) {
            res.send({result: 'error', error: err});
          } else {
            res.send({result: 'ok', data: ranking});
          }
        })
        
      }
  });
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
