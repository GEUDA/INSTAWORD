// sessions

var _ = require('underscore')
  , async = require('async')
  , models = require('../../models')
  , lib = require('../../lib')
  ;

var validator = require('validator');
var crypt = require('../../lib/crypt');
var mail = require('../../lib/mail');

var REGISTER_TIMEOUT = 1000 * 60 * 60 * 3; // 3時間
var LOGIN_ERROR_MESSAGE = 'Please enter a correct email address and password. Note that both fields are case-sensitive.'
var ADDRESS_ALREADY_USED_MESSAGE = 'This email address is already registered.';
var ADDRESS_CAN_NOT_USE_MESSAGE = 'This email address can not use.';

/* 仮登録ユーザリスト */
var waiting_list = [];
var WaitUser = function(email_address, password, token, timer_id) {
  this.email_address = email_address;
  this.password = password;
  this.token = token;
  this.timer_id = timer_id;
};





/* ログイン画面 */
exports.login = function(req, res, next) {
  if(req.session.user_id != null) {
    return res.redirect('../../');
  }

  return res.render('sessions/login', {
    title: 'Instaword - login',
    message: req.flash('loginError')
  });
};

/* 認証 */
exports.auth = function(req, res, next) {
  var email_address = req.param('email_address');
  var password = req.param('password');
  var remember = req.param('remember');

  if(!validator.isEmail(email_address)) {
    req.flash('loginError', ADDRESS_CAN_NOT_USE_MESSAGE);
    return res.redirect('back');
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
      req.flash('loginError', LOGIN_ERROR_MESSAGE);
      return res.redirect('back');
    }
    else
    {
      if(remember) {
        lib.setCookie(res, JSON.stringify(result.token));
      }
      req.session.user_id = result.token.user_id;
      return res.redirect('../../');
    }
  });
};

/* 新規ユーザ登録画面 */
exports.sign = function(req, res, next) {
  return res.render('sessions/sign', {
    title: 'Instaword - sign up',
    message: req.flash('signError')
  });
};

/* 新規ユーザ登録 */
exports.create = function(req, res, next) {
  var email_address = req.param('email_address');
  var password = req.param('password');

  password = validator.escape(password);
  password = crypt.create(password);

  if(validator.isEmail(email_address)) {
    async.waterfall([
      // make token
      function(callback) {
        require('crypto').randomBytes(48, function(ex, buf) {
          callback(null, buf.toString('hex'));
        });
      },
      // push waiting list
      function(token, callback) {
        var timer_id = setTimeout(function(token) {
          _.reject(waiting_list, function(item) { return item.token == token; });
        }, REGISTER_TIMEOUT);
        waiting_list.push(new WaitUser(email_address, password, token, timer_id));
        callback(null, token);
      },
      // send email
      function(token, callback) {
        mail.sendRegistrationUrl(email_address, token);
        callback(null, true);
      }
    ],
    function(error, result) {
      if(error) {
        return next(error);
      }
      return res.render('sessions/wait', { title: 'Instaword - sign up' });
    });
  }
  else
  {
    req.flash('signError', ADDRESS_CAN_NOT_USE_MESSAGE);
    return res.redirect('back');
  }
};

/* 本登録 */
exports.register = function(req, res, next) {
  var token = req.param('token');
  var is_exist = false;

  // 登録待ちのリストを確認
  _.each(waiting_list, function(item) {
    if(item.token == token) {
      is_exist = true;
      // registration
      var data = {
        email_address: item.email_address,
        password: item.password
      };
      models.user.create(data, function(error, result) {
        if(error) {
          return next(error);
        }

        clearTimeout(item.timer_id);
        _.reject(waiting_list, function(item) { return item.token == token; });

        return res.render('sessions/register_success', { title: 'Instaword - registration' });
      });
    }
  });

  // 期限切れのトークン
  if(!is_exist) {
    return res.render('sessions/register_fail', { title: 'Instaword - registration' });
  }
};

/* パスワード変更 */
exports.update = function(req, res, next) {
  var user_id = req.session.user_id;
  var password = req.param('password');
  var new_password = req.param('new_password');

  password = validator.escape(password);
  new_password = validator.escape(new_password);
  new_password = crypt.create(new_password);

  async.waterfall([
    // make token
    function(callback) {
      var data = {
        user_id: user_id,
        password: password,
        new_password: new_password
      };
      models.user.update(data, function(error, result) {
        if(error) {
          callback(error);
          return;
        }
        callback(null, result);
      });
    }
  ],
  function(error, result) {
    if(error) {
      return next(error);
    }
    return res.send(result);
  });
};

/* ログアウト */
exports.logout = function(req, res, next) {
  req.session.destroy();
  res.clearCookie('authtoken', { path: '/' });
  res.redirect('../login');
};

/* 退会画面 */
exports.resign = function(req, res, next) {
  return res.render('sessions/resign', { title: 'Instaword - resignation' });
};

/* 退会処理 */
exports.delete = function(req, res, next) {
  var data = {
    user_id: req.session.user_id
  };
  models.user.delete(data, function(error, result) {
    if(error) {
      return next(error);
    }
    return res.render('sessions/thanks', { title: 'Instaword - thanks' });
  });
};



/* Eメールアドレスのチェック */
exports.checkEmail = function(req, res, next) {
  var email_address = req.param('email_address');
  var data = {
    email_address: email_address
  };

  if(!validator.isEmail(email_address)) {
    return res.send(false);
  };

  models.user.checkEmail(data, function(error, result) {
    if(error) {
      return next(error);
    }
    if(result) {
      return res.send(true); // 使用可能
    }
    else
    {
      return res.send(false); // 使用不可能
    }
  });
};



/* 認証 */
exports.checkAuth = function(req, res, next) {
  var email_address = req.param('email_address');
  var password = req.param('password');
  var remember = req.param('remember');

  if(!validator.isEmail(email_address)) {
    req.flash('loginError', ADDRESS_CAN_NOT_USE_MESSAGE);
    return res.redirect('back');
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
      return res.send(false);
    }
    else
    {
      return res.send(true);
    }
  });
};

/* トークン取得 */
exports.getToken = function(req, res, next) {
  if(req.session.is_auth) {
    return res.send(req.session.token);
  }
  return res.send(null);
};
