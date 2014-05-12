// group

var _ = require('underscore')
  , async = require('async')
  , models = require('../../models')
  , lib = require('../../lib')
  , TextPreprocessing = require('../../lib/text_preprocessing')
  ;

var validator = require('validator');
var mail = require('../../lib/mail');

var REGISTER_TIMEOUT = 1000 * 60 * 60 * 24 * 3; // 3日間

/* 仮登録ユーザリスト */
var waiting_list = [];
var WaitUser = function(group_id, token, timer_id) {
  this.group_id = group_id;
  this.token = token;
  this.timer_id = timer_id;
};



/* グループ情報取得 */
exports.get = function(req, res, next) {
  var data = {
    _id: req.param('group_id'),
    user_id: req.session.user_id
  };

  models.group.get(data, function(error, result) {
    if(error) {
      return next(error);
    }

    result.group_name = TextPreprocessing.decode(result.group_name);
    result.group_name = validator.escape(result.group_name);

    res.send(JSON.stringify(result));
  });
};

/* グループリスト取得 */
exports.list = function(req, res, next) {
  var data = {
    user_id: req.session.user_id
  };

  models.group.list(data, function(error, result) {
    if(error) {
      return next(error);
    }

    _.each(result, function(item, i) {
      item.group_name = TextPreprocessing.decode(item.group_name);
      result[i].group_name = validator.escape(item.group_name);
    });

    res.send(JSON.stringify(result));
  });
};



/* グループ作成 */
exports.create = function(req, res, next) {
  var data = {
    user_id: req.session.user_id,
    group_name: req.param('group_name')
  };

 data.group_name = TextPreprocessing.encode(data.group_name);

  models.group.create(data, function(error, result) {
    if(error) {
      return next(error);
    }

    res.send(result);
  });
};

/* 新規ユーザー招待 */
exports.invite = function(req, res, next) {
  //var email_address = req.param('email_address');
  var group_id = req.param('group_id');
  var group_name = '';

  //var message = req.param('message');
  //message = TextPreprocessing.encode(message);
  //message = TextPreprocessing.decode(message);
  //message = validator.escape(message);
  //message = message.replace(/\n/g, '<br/>');

  async.waterfall([
    // グループ名を取得
    function(callback) {
      var data = {
        _id: group_id
      };

      models.group.get(data, function(error, result) {
        if(error) {
          callback(error);
          return;
        }

        result.group_name = TextPreprocessing.decode(result.group_name);
        result.group_name = validator.escape(result.group_name);

        group_name = result.group_name;
        callback(null);
      });
    },
    // トークンを作成
    function(callback) {
      require('crypto').randomBytes(48, function(ex, buf) {
        callback(null, buf.toString('hex'));
      });
    },
    // 待機リストに追加
    function(token, callback) {
      var timer_id = setTimeout(function(token) {
        _.reject(waiting_list, function(item) { return item.token == token; });
      }, REGISTER_TIMEOUT);
      waiting_list.push(new WaitUser(group_id, token, timer_id));
      callback(null, token);
    },
    // メール送信
    function(token, callback) {
      //mail.sendGroupRegistrationUrl(email_address, token, group_name, message);
      callback(null, token);
    }
  ],
  function(error, result) {
    if(error) {
      return next(error);
    }

    res.send(JSON.stringify({
      group_name: group_name,
      url: 'https://pickmemo.net/instaword/groups/register/' + result
    }));
  });
};

/* グループ登録 */
exports.register = function(req, res, next) {
  var token = req.param('token');
  var group_id = '';
  var is_exist = false;

  // 登録待ちのリストを確認
  _.each(waiting_list, function(item) {
    if(item.token != token) {
      return;
    }

    is_exist = true;

    async.waterfall([
      // グループの重複登録チェック
      function(callback) {
        var data = {
          _id: item.group_id,
          user_id: req.session.user_id
        };
        models.group.check(data, function(error, result) {
          if(error) {
            callback(error);
            return;
          }

          callback(null, result);
        });
      },
      // グループの登録
      function(is_already, callback) {
        if(is_already) {
          callback(null, null);
          return;
        }

        var data = {
          _id: item.group_id,
          user_id: req.session.user_id
        };
        models.group.set(data, function(error, result) {
          if(error) {
            callback(error);
            return;
          }

          clearTimeout(item.timer_id);
          _.reject(waiting_list, function(item) { return item.token == token; });

          callback(null, item.group_id);
        });
      }
    ],
    function(error, result) {
      if(error) {
        return next(error);
      }

      // 登録済み
      if(!result) {
        return res.render('groups/register_already', { title: 'Instaword - registration' });
      }

      // 成功
      return res.render('groups/register_success', { title: 'Instaword - registration', group_id: result });
    });
  });

  // 期限切れのトークン
  if(!is_exist) {
    return res.render('groups/register_fail', { title: 'Instaword - registration' });
  }
};

/* グループ脱退 */
exports.remove = function(req, res, next) {
  var data = {
    _id: req.param('group_id'),
    user_id: req.session.user_id
  };

  models.group.remove(data, function(error, result) {
    if(error) {
      return next(error);
    }

    res.send(result);
  });
};

/* グループの削除 */
exports.delete = function(req, res, next) {
  var data = {
    _id: req.param('group_id'),
    user_id: req.session.user_id
  };

  models.group.delete(data, function(error, result) {
    if(error) {
      return next(error);
    }

    res.send(result);
  });
};



/* グループページの表示 */
exports.view = function(req, res) {
  var group_id = req.param('group_id');
  return res.render('groups/index', {title: 'Instaword', group_id: group_id});
};



exports.documents = require('./documents');
exports.favorites = require('./favorites');
