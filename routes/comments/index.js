// sessions

var _ = require('underscore')
  , async = require('async')
  , models = require('../../models')
  , lib = require('../../lib')
  , DocumentModel = models.DocumentModel
  , TextPreprocessing = require('../../lib/text_preprocessing')
  , impressionEngine = require('../words')
  ;

var validator = require('validator');



/* get */
exports.get = function(req, res, next) {
  var data = {
    user_id: req.session.user_id,
    target_id: req.param('target_id')
  };

  models.comment.get(data, function(error, result) {
    if(error) {
      return next(error);
    }

    var list = [];

    _.each(result, function(item) {
      var comment = {
        _id: item._id,
        body: item.body,
        updated_at: item.updated_at,
        created_at: item.created_at,
        is_owner: item.is_owner
      };

      comment.body = TextPreprocessing.decode(comment.body);
      comment.body = validator.escape(comment.body);

      list.push(comment);
    });

    res.send(JSON.stringify(list));
  });
};



/* post */
exports.post = function(req, res, next) {
  async.waterfall([
    function(callback) {
      var data = {
        user_id: req.session.user_id,
        target_id: req.param('target_id'),
        body: req.param('body')
      };

      // encode
      data.body = TextPreprocessing.encode(data.body);

      models.comment.post(data, function(error, result) {
        if(error) {
          return callback(error);
        }
        callback(null);
      });
    },
    function(callback) {
      var data = {
        _id: req.param('target_id')
      };

      models.group.document.update(data, function(error, result) {
        if(error) {
          return callback(error);
        }
        callback(null);
      });
    }
  ],
  function(error, result) {
    if(error) {
      return next(error);
    }
    res.send('POSTED');
  });
};

/* edit */
exports.edit = function(req, res, next) {
  var data = {
    user_id: req.session.user_id,
    _id: req.param('_id'),
    body: req.param('body')
  };

  data.body = TextPreprocessing.encode(data.body);

  models.comment.edit(data, function(error, result) {
    if(error) {
      return next(error);
    }
    res.send('UPDATED');
  });
};

/* remove */
exports.remove = function(req, res, next) {
  var data = {
    user_id: req.session.user_id,
    _id: req.param('_id')
  };

  async.waterfall([
    function(callback) {
      models.comment.remove(data, function(error, result) {
        if(error) {
          return callback(error);
        }
        callback(null);
      });
    }
  ],
  function(error) {
    if(error) {
      return next(error);
    }
    res.send('REMOVED');
  });
};
