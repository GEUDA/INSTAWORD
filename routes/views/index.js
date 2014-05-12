/*
 * GET home page.
 */

var _ = require('underscore')
  , async = require('async')
  , models = require('../../models')
  , lib = require('../../lib')
  , TextPreprocessing = require('../../lib/text_preprocessing')
  , validator = require('validator')
  ;



exports.set = function(req, res, next) {
  var data = {
    user_id: req.session.user_id,
    _id: req.param('_id')
  };

  async.waterfall([
    function(callback) {
      models.view.set(data, function(error, result) {
        if(error) {
          return callback(error);
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



exports.get = function(req, res, next) {
  var memo = null;
  var is_exist = false;

  async.waterfall([
    // public
    function(callback) {
      var data = {
        _id: req.param('_id')
      };

      models.document.get(data, function(error, result) {
        if(error) {
          return callback(error);
        }

        if(result != null) {
          memo = result;
          is_exist = true;
        }

        callback(null);
      });
    },
    // group
    function(callback) {
      if(is_exist) {
        return callback(null);
      }

      var data = {
        _id: req.param('_id')
      };

      models.group.document.get(data, function(error, result) {
        if(error) {
          return callback(error);
        }

        if(result != null) {
          memo = result;
          is_exist = true;
        }

        callback(null);
      });
    },
    // set read
    function(callback) {
      if(!is_exist) {
        return callback(null);
      }

      var data = {
        user_id: req.session.user_id,
        _id: req.param('_id')
      };

      models.view.set(data, function(error, result) {
        if(error) {
          return callback(error);
        }
        callback(null, result);
      });
    }
  ],
  function(error, result) {
    if(error) {
      return next(error);
    }

    if(!is_exist) {
      return res.render('documents/show', {
        _id: '',
        group_id: '',
        title: 'NOT FOUND',
        body: '参照しようとしたメモは存在しないか、既に削除されています。',
        updated: '--'
      });
    }

    memo.title = TextPreprocessing.decode(memo.title);
    memo.body = TextPreprocessing.decode(memo.body);
    memo.title = validator.escape(memo.title);
    memo.body = validator.escape(memo.body);

    memo.body = memo.body.replace(/\n/g, '<br />');

    var dd = new Date(memo.updated_at);
    memo.updated = dd.getFullYear() + '-' + (dd.getMonth() + 1) + '-' + dd.getDate();

    return res.render('documents/show', {
      _id: memo._id,
      group_id: memo.group_id,
      title: memo.title,
      body: memo.body,
      updated: memo.updated
    });
  });
};
