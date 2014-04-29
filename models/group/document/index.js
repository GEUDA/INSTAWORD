/* group document */

var _ = require('underscore')
  , async = require('async')
  , models = require('../../')
  , mt = require('../../../lib/mt').getGenerator();
  ;

var GroupDocumentModel = models.GroupDocumentModel
  ;

var COUNT_LIMIT = 500;


/**
 * get
 * @param {Object<_id>} data
 * @param {Function} callback
 * @callback(error, document)
 */
exports.get = function(data, callback) {
  var field = '_id title body language updated_at created_at';
  var condition = {
    _id: data._id
  }
  GroupDocumentModel.findOne(condition, field, {}, function(error, result) {
    if(error) {
      callback(error);
      return;
    }
    callback(null, result);
  });
};



/**
 * random
 * @param {Object<user_id, group_id, lanugage_list>} data
 * @param {Function} callback
 * @callback(error, document_list)
 */
exports.random = function(data, callback) {
  var field = '_id title body user_id language updated_at created_at';

  // TODO language filter

  async.waterfall([
    // 行数を取得
    function(callback) {
      var condition = {
        group_id: data.group_id
      };

      GroupDocumentModel.count(condition, function(error, result) {
        if(error) {
          callback(error);
          return;
        }
        callback(null, result);
      });
    },
    // ランダム抽出
    function(size, callback) {
      var count = 0;
      var num_list = [];
      async.whilst(
        function() {
          return num_list.length < data.range && num_list.length < size && count < COUNT_LIMIT;
        },
        function(callback) {
          var num = mt.nextInt(size);
          if(!_.contains(num_list, num)) {
            num_list.push(num);
          }
          count++;
          callback(null);
        },
        function(error) {
          if(error) {
            callback(error);
            return;
          }
          callback(null, num_list);
        }
      );
    },
    // データ読み込み
    function(num_list, callback) {
      var count = 0;
      var document_list = [];

      async.whilst(
        function() {
          return count < num_list.length;
        },
        function(callback) {
          var condition = {
            group_id: data.group_id
          };
          var option = {
            limit: 1,
            skip: num_list[count]
          };
          GroupDocumentModel.find(condition, field, option, function(error, result) {
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
                is_owner: false
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
 * list
 * @param {Object<user_id, group_id, offset, range>} data
 * @param {Function} callback
 * @callback(error, is_success)
 */
exports.list = function(data, callback) {
  var field = '_id title body language updated_at created_at';
  var condition = {
    user_id: data.user_id,
    group_id: data.group_id
  };
  var option = {
    skip: data.offset,
    limit: data.range,
    sort: { updated_at: -1 }
  };
  GroupDocumentModel.find(condition, field, option, function(error, result) {
    if(error) {
      callback(error);
      return;
    }
    callback(null, result);
  });
};



/**
 * timeline
 * @param {Object<user_id, group_id, offset, range>} data
 * @param {Function} callback
 * @callback(error, is_success)
 */
exports.timeline = function(data, callback) {
  var field = '_id title body user_id language updated_at created_at';
  var condition = {
    group_id: data.group_id
  };
  var option = {
    skip: data.offset,
    limit: data.range,
    sort: { updated_at: -1 }
  };
  GroupDocumentModel.find(condition, field, option, function(error, result) {
    if(error) {
      callback(error);
      return;
    }

    var list = [];
    _.each(result, function(item, index) {
      var el = {
        _id: item._id,
        title: item.title,
        body: item.body,
        language: item.language,
        updated_at: item.updated_at,
        created_at: item.created_at,
        is_owner: false
      };

      if(item.user_id == data.user_id) {
        el.is_owner = true;
      }

      list.push(el);
    });

    callback(null, list);
  });
}



/**
 * post
 * @param {Object<title, body, language, user_id, group_id>} data
 * @param {Function} callback
 * @callback(error, is_success)
 */
exports.post = function(data, callback) {
  var post = new GroupDocumentModel({
    title: data.title,
    body: data.body,
    language: data.language,
    user_id: data.user_id,
    group_id: data.group_id
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
    title: data.title,
    body: data.body,
    language: data.language,
    updated_at: new Date()
  };
  GroupDocumentModel.findOneAndUpdate(condition, update, function(error, numAffected) {
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
      GroupDocumentModel.findOneAndRemove(condition, function(error, result) {
        if(error) {
          callback(error);
          return;
        }

        if(!result) {
          callback(null, false);
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
