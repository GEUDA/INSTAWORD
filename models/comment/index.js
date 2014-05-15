/* user */

var _ = require('underscore')
  , async = require('async')
  , models = require('../')
  , mt = require('../../lib/mt').getGenerator();
  ;

var CommentModel = models.CommentModel
  ;



/**
 * get
 * @param {Object<_id>} data
 * @param {Function} callback
 * @callback(error, document)
 */
exports.get = function(data, callback) {
  var field = '_id body user_id updated_at created_at';
  var condition = {
    target_id: data.target_id
  };
  var option = {
    sort: { created_at: 1 }
  };
  var list = [];

  CommentModel.find(condition, field, {}, function(error, result) {
    if(error) {
      callback(error);
      return;
    }

    _.each(result, function(item) {
      var comment = {
        _id: item._id,
        body: item.body,
        updated_at: item.updated_at,
        created_at: item.created_at,
        is_owner: false
      };

      if(data.user_id == item.user_id) {
        comment.is_owner = true;
      }

      list.push(comment);
    });

    callback(null, list);
  });
};



/**
 * post
 * @param {Object<title, body, language, user_id>} data
 * @param {Function} callback
 * @callback(error, is_success)
 */
exports.post = function(data, callback) {
  var post = new CommentModel({
    target_id: data.target_id,
    body: data.body,
    user_id: data.user_id
  });
  post.save(function(error, result) {
    if(error) {
      callback(error);
      return;
    }
    callback(null, 'POSTED');
  });
};



/**
 * edit
 * @param {Object<_id, user_id, title, body, language>} data
 * @param {Function} callback
 * @callback(error, is_success)
 */
exports.edit = function(data, callback) {
  var condition = {
    _id: data._id,
    user_id: data.user_id
  };
  var update = {
    body: data.body,
    updated_at: new Date()
  };
  CommentModel.findOneAndUpdate(condition, update, function(error, numAffected) {
    if(error) {
      callback(error);
      return;
    }
    callback(null, 'UPDATED');
  });
};



/**
 * remove
 * @param {Object<_id, user_id>} data
 * @param {Function} callback
 * @callback(error, is_success)
 */
exports.remove = function(data, callback) {
  async.waterfall([
    function(callback) {
      var condition = {
        _id: data._id,
        user_id: data.user_id
      };
      CommentModel.findOneAndRemove(condition, function(error, result) {
        if(error) {
          callback(error);
          return;
        }

        if(!result) { callback(null, false);
          return;
        }

        callback(null, true);
      });
    }
  ],
  function(error, result) {
    if(error) {
      callback(error);
      return;
    }

    callback(null, result);
  });
};



/**
 * chain
 * @param {Object<_id, user_id>} data
 * @param {Function} callback
 * @callback(error, is_success)
 */
exports.chain = function(data, callback) {
  var condition = {
    target_id: data.target_id
  };

  CommentModel.remove(condition, function(error) {
    if(error) {
      callback(error);
      return;
    }
    callback(null, 'REMOVED');
  });
};
