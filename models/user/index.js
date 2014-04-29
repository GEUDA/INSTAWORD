/* user */

var _ = require('underscore')
  , async = require('async')
  , models = require('../')
  , crypt = require('../../lib/crypt')
  ;

var UserModel = models.UserModel
  , CountModel = models.CountModel
  ;



var LOGIN_ERROR_MESSAGE = 'Please enter a correct email address and password. Note that both fields are case-sensitive.';


/**
 * check
 * @param {Object<user_id, authcookie>} data
 * @param {Function} callback
 * @callback(error, is_success)
 */
exports.check = function(data, callback) {
  var condition = {
    user_id: data.user_id,
    authcookie: data.authcookie
  }
  async.waterfall([
    function(callback) {
      UserModel.findOne(condition, function(error, result) {
        if(error) {
          callback(error);
          return;
        }
        if(!result) {
          callback(null, false);
        }
        else
        {
          callback(null, true);
        }
      });
    },
    function(is_exist, callback) {
      if(is_exist) {
        var update = {
          authcookie: models.getAuthCookie(),
          updated_at: new Date()
        };
        UserModel.update(condition, update, function(error, numAffected) {
          if(error) {
            callback(error);
            return;
          }
          var token = {
            user_id: data.user_id,
            authcookie: update.authcookie
          }
          callback(null, {is_exist: true, token: token});
        });
      }
      else
      {
        callback(null, {is_exist: false, token: null});
      }
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
 * auth
 * @param {Object<email_address, password} data
 * @param {Function} callback
 * @callback(error, is_success)
 */
exports.auth = function(data, callback) {
  var condition = {
    email_address: data.email_address
  };
  UserModel.findOne(condition, function(error, result) {
    if(error) {
      callback(error);
      return;
    }

    if(!result) {
      callback(null, {status: 'LOGIN ERROR', token: null});
      return;
    }
    else
    if(!crypt.compare(data.password, result.password)) {
      callback(null, {status: 'LOGIN ERROR', token: null});
      return;
    }

    var token = {
      user_id: result.user_id,
      authcookie: result.authcookie
    }
    callback(null, {status: 'AUTHORIZED', token: token});
  });
};



/**
 * create
 * @param {Object<email_address, password>} data
 * @param {Function} callback
 * @callback(error, is_success)
 */
exports.create = function(data, callback) {
  async.waterfall([
    function(callback) {
      CountModel.getNewId('user_id', function(error, result) {
        if(error) {
          callback(error);
          return;
        }
        callback(null, result.count);
      });
    },
    function(next_id, callback) {
      var user = new UserModel({
        user_id: next_id,
        email_address: data.email_address,
        password: data.password
      });
      user.save(function(error, result) {
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
    callback(null, result);
  });
};



/**
 * update
 * @param {user_id, password, new_password} data
 * @param {Function} callback
 * @callback(error, is_success)
 */
exports.update = function(data, callback) {
  var condition = {
    user_id: data.user_id
  };
  async.waterfall([
    function(callback) {
      UserModel.findOne(condition, function(error, result) {
        if(error) {
          callback(error);
          return;
        }

        if(!result) {
          callback(null, false);
          return;
        }
        else
        if(!crypt.compare(data.password, result.password)) {
          callback(null, false);
          return;
        }

        callback(null, true);
      });
    },
    function(is_auth, callback) {
      if(!is_auth) {
        callback(null, false)
        return;
      }

      var update = {
        password: data.new_password
      };
      UserModel.update(condition, update, function(error, numAffected) {
        if(error) {
          callback(error);
          return;
        }
        callback(null, true);
      });
    }
  ],
  function(error, result) {
    callback(null, result);
  });
};



/**
 * delete
 * @param {user_id} data
 * @param {Function} callback
 * @callback(error, is_success)
 */
exports.delete = function(data, callback) {
  var condition = {
    user_id: data.user_id
  };
  UserModel.remove(condition, function(error) {
    if(error) {
      callback(error);
      return;
    }
    callback(null, 'DELETED');
  });
};



/**
 * checkEmail
 * @param {email_address} data
 * @param {Function} callback
 * @callback(error, is_success)
 */
exports.checkEmail = function(data, callback) {
  var condition = {
    email_address: data.email_address
  };
  UserModel.findOne(condition, function(error, result) {
    if(error) {
      callback(error);
      return;
    }

    if(!result) {
      callback(null, true);
    }
    else
    {
      callback(null, false);
    }
  });
};



// TODO: extinction
// favorite
// group member
// group favorite
