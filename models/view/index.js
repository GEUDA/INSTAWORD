/* view */

var _ = require('underscore')
  , async = require('async')
  , models = require('../')
  , mt = require('../../lib/mt').getGenerator();
  ;

var ViewModel = models.ViewModel
  ;



/**
 * get
 * @param {Object<_id, user_id>} data
 * @param {Function} callback
 * @callback(error, document)
 */
exports.get = function(data, callback) {
  var view = {
    count: 0,
    is_read: false
  };

  async.waterfall([
    // お気に入り数
    function(callback) {
      var condition = {
        target_id: data._id
      }
      var field = '_id target_id count user_list';
      var option = {};
      ViewModel.findOne(condition, field, option, function(error, result) {
        if(error) {
          callback(error);
          return;
        }

        if(result == null) {
          callback(null);
          return;
        }

        view.count = result.count;
        if(_.contains(result.user_list, data.user_id)) {
          view.is_read = true;
        }

        callback(null);
      });
    },
  ],
  function(error, result) {
    if(error) {
      callback(error);
      return;
    }
    callback(null, view);
  });
};



/**
 * set
 * @param {Object<_id, user_id>} data
 * @param {Function} callback
 * @callback(error, document)
 */
exports.set = function(data, callback) {
  var view = {
    count: 0,
    is_read: false
  };

  async.waterfall([
    // お気に入り数
    function(callback) {
      var condition = {
        target_id: data._id
      }
      var field = '_id target_id count user_list';
      var option = {};
      ViewModel.findOne(condition, field, option, function(error, result) {
        if(error) {
          callback(error);
          return;
        }

        if(result == null) {
          callback(null, null);
          return;
        }

        view.count = result.count;

        if(_.contains(result.user_list, data.user_id)) {
          view.is_read = true;
        }

        callback(null, result);
      });
    },
    function(old_view, callback) {
      if(!old_view) {
        var post = new ViewModel({
          target_id: data._id,
          count: 1,
          user_list: []
        });

        post.user_list.push(data.user_id);

        post.save(function(error, result) {
          if(error) {
            callback(error);
          }
          callback(null);
        });
      }
      else
      {
        var update = {
          count: old_view.count + 1,
          updated_at: Date.now()
        }

        if(!view.is_read) {
          update.user_list = old_view.user_list;
          update.user_list.push(data.user_id);
        }

        ViewModel.update({_id: old_view._id}, update, function(error, result) {
          if(error) {
            callback(error);
          }
          callback(null);
        });
      }
    }
  ],
  function(error, result) {
    if(error) {
      callback(error);
      return;
    }
    callback(null, 'VIEW');
  });
};



/**
 * remove
 * @param {Object<_id, user_id>} data
 * @param {Function} callback
 * @callback(error, is_success)
 */
exports.remove = function(data, callback) {
  var condition = {
    target_id: data._id
  };
  ViewModel.findOneAndRemove(condition, function(error) {
    if(error) {
      callback(error);
      return;
    }
    callback(null, 'DELETE');
  });
};
