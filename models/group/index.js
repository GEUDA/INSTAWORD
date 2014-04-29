/* group */

var _ = require('underscore')
  , async = require('async')
  , models = require('../')
  , mt = require('../../lib/mt').getGenerator();
  ;

var GroupMemberModel = models.GroupMemberModel
  , GroupDocumentModel = models.GroupDocumentModel
  , GroupFavoriteModel = models.GroupFavoriteModel
  , GroupModel = models.GroupModel
  ;



/**
 * get
 * @param {Object<_id, user_id>} data
 * @param {Function} callback
 * @callback(error, group)
 */
exports.get = function(data, callback) {
  var field = '_id group_name user_id updated_at created_at';

  async.waterfall([
    // グループ情報取得
    function(callback) {
      var condition = {
        _id: data._id
      };
      GroupModel.findOne(condition, function(error, result) {
        if(error) {
          callback(error);
          return;
        }
        callback(null, result);
      });
    },
    // メンバー数取得
    function(group, callback) {
      var condition = {
        target_id: data._id
      };
      GroupMemberModel.count(condition, function(error, result) {
        if(error) {
          callback(error);
          return;
        }

        if(result == 0) {
          callback(null, null);
          return;
        }

        var item = {
          _id: group._id,
          group_name: group.group_name,
          updated_at: group.updated_at,
          created_at: group.created_at,
          is_owner: false,
          count: result
        };

        if(group.user_id == data.user_id) {
          item.is_owner = true;
        }

        callback(null, item);
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
 * list
 * @param {Object<user_id>} data
 * @param {Function} callback
 * @callback(error, group)
 */
exports.list = function(data, callback) {
  var field = '_id group_name user_id updated_at created_at';

  async.waterfall([
    // グループリスト取得
    function(callback) {
      var condition = {
        user_id: data.user_id
      };
      var option = {
        sort: { created_at: -1 }
      };
      GroupMemberModel.find(condition, 'target_id', option, function(error, result) {
        if(error) {
          callback(error);
          return;
        }
        callback(null, result); 
      });
    },
    // グループ情報の取得
    function(group_member_list, callback) {
      var count = 0;
      var group_list = [];

      async.whilst(
        function() {
          return count < group_member_list.length;
        },
        function(callback) {
          var condition = {
            _id: group_member_list[count].target_id
          };
          var option = {
            limit: 1,
          };
          GroupModel.find(condition, field, option, function(error, result) {
            if(error) {
              callback(error);
              return;
            }
            if(result.length == 1) {
              var item = {
                _id: result[0]._id,
                group_name: result[0].group_name,
                updated_at: result[0].updated_at,
                created_at: result[0].created_at,
                is_owner: false
              };

              if(data.user_id == result[0].user_id) {
                item.is_owner = true;
              }

              group_list.push(item);
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
          callback(null, group_list);
        }
      );
    },
    // メンバー数の取得
    function(group_list, callback) {
      var count = 0;
      var list = [];

      async.whilst(
        function() {
          return count < group_list.length;
        },
        function(callback) {
          var condition = {
            target_id: group_list[count]._id
          };
          GroupMemberModel.count(condition, function(error, result) {
            if(error) {
              callback(error);
              return;
            }
            if(result > 0) {
              var item = {
                _id: group_list[count]._id,
                group_name: group_list[count].group_name,
                updated_at: group_list[count].updated_at,
                created_at: group_list[count].created_at,
                is_owner: group_list[count].is_owner,
                count: result
              };

              list.push(item);
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
          callback(null, list);
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
 * set
 * @param {Object<_id, user_id>} data
 * @param {Function} callback
 * @callback(error, is_success)
 */
exports.set = function(data, callback) {
  async.waterfall([
    // グループメンバーの追加
    function(callback) {
      var group_member = new GroupMemberModel({
        target_id: data._id,
        user_id: data.user_id
      });
      group_member.save(function(error, result) {
        if(error) {
          callback(error);
          return;
        }
        callback(null);
      });
    },
    // グループの更新
    function(callback) {
      var update = {
        updated_at: new Date()
      };
      GroupModel.findOneAndUpdate({_id: data._id}, update, function(error, numAffected) {
        if(error) {
          callback(error);
          return;
        }
        callback(null);
      });
    }
  ],
  function(error, result) {
    if(error) {
      callback(error);
      return;
    }
    callback(null, 'SIGNED');
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
    // グループメンバーの除去
    function(callback) {
      var condition = {
        target_id: data._id,
        user_id: data.user_id
      };
      GroupMemberModel.findOneAndRemove(condition, function(error) {
        if(error) {
          callback(error);
          return;
        }
        callback(null);
      });
    },
    // グループの更新
    function(callback) {
      var update = {
        updated_at: new Date()
      };
      GroupModel.findOneAndUpdate({_id: data._id}, update, function(error, numAffected) {
        if(error) {
          callback(error);
          return;
        }
        callback(null);
      });
    },
    // グループの消滅をチェック
    function(callback) {
      var condition = {
        target_id: data._id
      };
      GroupMemberModel.count(condition, function(error, result) {
        if(error) {
          callback(error);
          return;
        }
        callback(null, result);
      });
    },
    function(count, callback) {
      if(count > 0) {
        callback(null);
        return;
      }

      var item = {
        _id: data._id
      };

      // 構成メンバーが存在しない場合
      exports.extinction(item, function(error, result) {
        if(error) {
          callback(error);
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
    callback(null, 'RESIGNED');
  });
};



/**
 * extinction
 * @param {Object<_id>} data
 * @param {Function} callback
 * @callback(error, is_success)
 */
exports.extinction = function(data, callback) {
  async.waterfall([
    // ドキュメントの除去
    function(callback) {
      var condition = {
        group_id: data._id
      };
      GroupDocumentModel.remove(condition, function(error) {
        if(error) {
          callback(error);
          return;
        }
        callback(null);
      });
    },
    // お気に入りの除去
    function(callback) {
      var condition = {
        group_id: data._id
      };
      GroupFavoriteModel.remove(condition, function(error) {
        if(error) {
          callback(error);
          return;
        }
        callback(null);
      });
    },
    // グループの除去
    function(callback) {
      var condition = {
        _id: data._id
      };
      GroupModel.findOneAndRemove(condition, function(error) {
        if(error) {
          callback(error);
          return;
        }
        callback(null);
      });
    }
  ],
  function(error, result) {
    if(error) {
      callback(error);
      return;
    }
    callback(null, true);
  });
};



/**
 * create
 * @param {Object<user_id, group_name>} data
 * @param {Function} callback
 * @callback(error, is_success)
 */
exports.create = function(data, callback) {
  async.waterfall([
    // グループ作成
    function(callback) {
      var group = new GroupModel({
        user_id: data.user_id,
        group_name: data.group_name
      });
      group.save(function(error, result) {
        if(error) {
          callback(error);
          return;
        }
        callback(null, result._id);
      });
    },
    // グループに作成者を追加
    function(group_id, callback) {
      var item = {
        _id: group_id,
        user_id: data.user_id
      };
      exports.set(item, function(error, result) {
        if(error) {
          callback(error);
          return;
        }
        callback(null);
      });
    }
  ],
  function(error, result) {
    if(error) {
      callback(error);
      return;
    }
    callback(null, 'CREATED');
  });
};



/**
 * delete
 * @param {Object<_id, user_id>} data
 * @param {Function} callback
 * @callback(error, is_success)
 */
exports.delete = function(data, callback) {
  async.waterfall([
    // グループの除去
    function(callback) {
      var condition = {
        _id: data._id,
        user_id: data.user_id
      };
      GroupModel.findOneAndRemove(condition, function(error, result) {
        if(error) {
          callback(error);
          return;
        }

        // グループが存在しない場合
        if(!result) {
          callback(null, false);
          return;
        }

        // グループが存在していた場合
        callback(null, true);
      });
    },
    // メンバーの除去
    function(is_exist, callback) {
      if(!is_exist) {
        callback(null, is_exist);
      }

      var condition = {
        target_id: data._id
      };
      GroupMemberModel.remove(condition, function(error) {
        if(error) {
          callback(error);
          return;
        }
        callback(null, is_exist);
      });
    },
    // ドキュメントの除去
    function(is_exist, callback) {
      if(!is_exist) {
        callback(null, is_exist);
      }

      var condition = {
        group_id: data._id
      };
      GroupDocumentModel.remove(condition, function(error) {
        if(error) {
          callback(error);
          return;
        }
        callback(null, is_exist);
      });
    },
    // お気に入りの除去
    function(is_exist, callback) {
      if(!is_exist) {
        callback(null, is_exist);
      }

      var condition = {
        group_id: data._id
      };
      GroupFavoriteModel.remove(condition, function(error) {
        if(error) {
          callback(error);
          return;
        }
        callback(null, is_exist);
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
 * check
 * @param {Object<_id, user_id>} data
 * @param {Function} callback
 * @callback(error, is_success)
 */
exports.check = function(data, callback) {
  var condition = {
    target_id: data._id,
    user_id: data.user_id
  };

  GroupMemberModel.findOne(condition, function(error, result) {
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
};



exports.document = require('./document');
exports.favorite = require('./favorite');
