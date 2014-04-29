// sessions

var _ = require('underscore')
  , async = require('async')
  , models = require('../../models')
  , lib = require('../../lib')
  , TextPreprocessing = require('../../lib/text_preprocessing')
  , impressionEngine = require('../words')
  ;

var validator = require('validator');



/* list */
exports.list = function(req, res, next) {
  async.waterfall([
    function(callback) {
      var data = {
        user_id: req.session.user_id,
        offset: req.param('offset'),
        range: req.param('range')
      };

      models.favorite.list(data, function(error, result) {
        if(error) {
          return next(error);
        }

        _.each(result, function(item, i) {
          item.title = TextPreprocessing.decode(item.title);
          item.body = TextPreprocessing.decode(item.body);
          result[i].title = validator.escape(item.title);
          result[i].body = validator.escape(item.body);
        });

        callback(null, result);
      });
    },
    function(document_list, callback) {
      var count = 0;
      var list = [];

      async.whilst(
        function() {
          return count < document_list.length;
        },
        function(callback) {
          var item = document_list[count];
          var data = {
            _id: item._id,
            user_id: req.session.user_id
          };

          models.view.get(data, function(error, result) {
            if(error) {
              callback(error);
              return;
            }

            var el = {
              _id: item._id,
              title: item.title,
              body: item.body,
              language: item.language,
              updated_at: item.updated_at,
              created_at: item.created_at,
              count: item.count,
              is_favorite: item.is_favorite,
              is_owner: item.is_owner,
              view_count: result.count,
              is_read: result.is_read
            };

            list.push(el);

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
      return next(error);
    }
    return res.send(JSON.stringify(result));
  });
};

/* set */
exports.set = function(req, res, next) {
  var data = {
    user_id: req.session.user_id,
    _id: req.param('_id')
  };

  models.favorite.set(data, function(error, result) {
    if(error) {
      return next(error);
    }
    res.send('FAVORITED');
  });
};

/* remove */
exports.remove = function(req, res, next) {
  var data = {
    user_id: req.session.user_id,
    _id: req.param('_id')
  };

  models.favorite.remove(data, function(error, result) {
    if(error) {
      return next(error);
    }
    res.send('UNFAVORITED');
  });
};
