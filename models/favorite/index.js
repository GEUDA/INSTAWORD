/* user */

var _ = require('underscore')
  , async = require('async')
  , models = require('../')
  , mt = require('../../lib/mt').getGenerator();
  ;

var FavoriteModel = models.FavoriteModel
  , DocumentModel = models.DocumentModel
  ;



/**
 * list
 * @param {Object<user_id, offset, range>} data
 * @param {Function} callback
 * @callback(error, document)
 */
exports.list = function(data, callback) {
  var field = '_id user_id title body language updated_at created_at';

  async.waterfall([
    // お気に入りリスト取得
    function(callback) {
      var condition = {
        user_id: data.user_id
      };
      var option = {
        skip: data.offset,
        limit: data.range,
        sort: { created_at: -1 }
      };
      FavoriteModel.find(condition, 'target_id', option, function(error, result) {
        if(error) {
          callback(error);
          return;
        }
        callback(null, result); 
      });
    },
    // ドキュメント取得
    function(favorite_list, callback) {
      var count = 0;
      var document_list = [];

      async.whilst(
        function() {
          return count < favorite_list.length;
        },
        function(callback) {
          var condition = {
            _id: favorite_list[count].target_id
          };
          var option = {
            limit: 1,
          };
          DocumentModel.find(condition, field, option, function(error, result) {
            if(error) {
              callback(error);
              return;
            }
            if(result.length == 1) {
              var item = {
                _id: result[0]._id,
                title: result[0].title,
                body: result[0].body,
                language: result[0].language,
                updated_at: result[0].updated_at,
                created_at: result[0].created_at,
                is_owner: false,
                is_favorite: true
              };

              if(result[0].user_id == data.user_id) {
                item.is_owner = true;
              }

              document_list.push(item);
            }
            count++;
            callback(null);
          });
        },
        function(error) {
          if(error) {
            callback(error);
            return;
          }
          callback(null, document_list);
        }
      );
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
 * get
 * @param {Object<_id, user_id>} data
 * @param {Function} callback
 * @callback(error, document)
 */
exports.get = function(data, callback) {
  var favorite = {
    count: 0,
    is_favorite: false
  };

  async.waterfall([
    // お気に入り数
    function(callback) {
      var condition = {
        target_id: data._id
      }
      FavoriteModel.count(condition, function(error, result) {
        if(error) {
          callback(error);
          return;
        }
        favorite.count = result;
        callback(null);
      });
    },
    // お気に入り判定
    function(callback) {
      var condition = {
        target_id: data._id,
        user_id: data.user_id
      }
      FavoriteModel.count(condition, function(error, result) {
        if(error) {
          callback(error);
          return;
        }
        if(result > 0) {
          favorite.is_favorite = true;
        }
        callback(null, result);
      });
    }
  ],
  function(error, result) {
    if(error) {
      callback(error);
      return;
    }
    callback(null, favorite);
  });
};



/**
 * set
 * @param {Object<_id, user_id>} data
 * @param {Function} callback
 * @callback(error, is_success)
 */
exports.set = function(data, callback) {
  var favorite = new FavoriteModel({
    target_id: data._id,
    user_id: data.user_id
  });
  favorite.save(function(error, result) {
    if(error) {
      callback(error);
      return;
    }
    callback(null, 'FAVORITED');
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
    target_id: data._id,
    user_id: data.user_id
  };
  FavoriteModel.findOneAndRemove(condition, function(error) {
    if(error) {
      callback(error);
      return;
    }
    callback(null, 'UNFAVORITED');
  });
};



/**
 * chain remove
 * @param {Object<_id>} data
 * @param {Function} callback
 * @callback(error, is_success)
 */
exports.chain = function(data, callback) {
  var condition = {
    target_id: data.target_id
  };
  FavoriteModel.remove(condition, function(error) {
    if(error) {
      callback(error);
      return;
    }
    callback(null, 'REMOVED');
  });
};

