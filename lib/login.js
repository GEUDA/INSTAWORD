// Route-Middleware
var models = require('../models')
  , _ = require('underscore')
  , async = require('async')
  , validator = require('validator')
  ;

var setCookie = require('./cookie').setCookie;



var TOKEN_TIMEOUT = 1000 * 60 * 60;

var auth_list = [];

var AuthUser = function(user_id, token, timer_id) {
  this.user_id = user_id;
  this.token = token;
  this.timer_id = timer_id;
};



exports.loginRequired = function(req, res, next) {
  checkToken(req, res, next);

  if(req.session.user_id) {
    return next();
  }

  if(!req.cookies.instaword_authtoken) {
    // do not have cookie and session
    return res.redirect('/instaword/sessions/login');
  }

  // have cookie
  var token = JSON.parse(req.cookies.instaword_authtoken);
  var data = {
    user_id: token.user_id,
    authcookie: token.authcookie
  }

  models.user.check(data, function(error, result) {
    if(error) {
      return next(error);
    }
    if(result.is_exist) {
      req.session.user_id = result.token.user_id;
      setCookie(res, JSON.stringify(result.token));
      next();
    }
    else
    {
      res.redirect('/instaword/sessions/login');
    }
  });
};



exports.loginRequiredPost = function(req, res, next) {
  checkToken(req, res, next);

  if(req.session.user_id) {
    return next();
  }

  if(!req.cookies.instaword_authtoken) {
    // do not have cookie and session
    return res.status(403);
  }

  // have cookie
  var token = JSON.parse(req.cookies.instaword_authtoken);
  var data = {
    user_id: token.user_id,
    authcookie: token.authcookie
  }

  models.user.check(data, function(error, result) {
    if(error) {
      return next(error);
    }
    if(result.is_exist) {
      req.session.user_id = result.token.user_id;
      setCookie(res, JSON.stringify(result.token));
      next();
    }
    else
    {
      res.status(403);
    }
  });
};



exports.loginChecker = function(req, res, next) {
  checkToken(req, res, next);

  if(req.session.user_id) {
    return next();
  }
  if(!req.cookies.instaword_authtoken) {
    // do not have cookie and session
    return next();
  }
  // have cookie
  var token = JSON.parse(req.cookies.instaword_authtoken);
  var data = {
    user_id: token.user_id,
    authcookie: token.authcookie
  }

  models.user.check(data, function(error, result) {
    if(error) {
      return next(error);
    }
    if(result.is_exist) {
      req.session.user_id = result.token.user_id;
      setCookie(res, JSON.stringify(result.token));
      next();
    }
    else
    {
      next();
    }
  });
};



exports.loginMakeToken = function(req, res, next) {
  var email_address = req.param('email_address');
  var password = req.param('password');

  if(!validator.isEmail(email_address)) {
    req.session.is_auth = false;
    return next();
  }

  password = validator.escape(password);

  var data = {
    email_address: email_address,
    password: password
  };

  models.user.auth(data, function(error, result) {
    if(error) {
      return next(error);
    }
    if(result.status == 'LOGIN ERROR') {
      req.session.is_auth = false;
      return next();
    }
    else
    {
      async.waterfall([
        function(callback) {
          require('crypto').randomBytes(48, function(ex, buf) {
            callback(null, buf.toString('hex'));
          });
        },
        function(token, callback) {
          var timer_id = setTimeout(function(token) {
            _.reject(auth_list, function(item) { return item.token == token; });
          }, TOKEN_TIMEOUT);
          auth_list.push(new AuthUser(result.token.user_id, token, timer_id));
          callback(null, token);
        }
      ],
      function(error, result) {
        req.session.is_auth = true;
        req.session.token = result;
        return next();
      });
    }
  });
};

var checkToken = function(req, res, next) {
  var token = req.param('token');
  if(token) {
    _.each(auth_list, function(item, index) {
      if(item.token == token) {
        clearTimeout(item.timer_id);

        var timer_id = setTimeout(function(token) {
          _.reject(auth_list, function(item) { return item.token == token; });
        }, TOKEN_TIMEOUT);
        auth_list[index].timer_id = timer_id;

        req.session.user_id = auth_list[index].user_id;
      }
    });
  }
};
