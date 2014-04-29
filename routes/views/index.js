/*
 * GET home page.
 */

var _ = require('underscore')
  , async = require('async')
  , models = require('../../models')
  , lib = require('../../lib')
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
