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
    _id: req.param('_id')
  };

  models.document.get(data, function(error, result) {
    if(error) {
      return next(error);
    }

    result.title = TextPreprocessing.decode(result.title);
    result.body = TextPreprocessing.decode(result.body);
    result.title = validator.escape(result.title);
    result.body = validator.escape(result.body);

    res.send(JSON.stringify(result));
  });
};

/* timeline */
exports.timeline = function(req, res, next) {
  async.waterfall([
    function(callback) {
      var data = {
        user_id: req.session.user_id,
        offset: req.param('offset'),
        range: req.param('range')
      };

      models.document.timeline(data, function(error, result) {
        if(error) {
          callback(error);
          return;
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

          models.favorite.get(data, function(error, result) {
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
              count: result.count,
              is_favorite: result.is_favorite,
              is_owner: item.is_owner
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
    res.send(JSON.stringify(result));
  });
};

/* list */
exports.list = function(req, res, next) {
  async.waterfall([
    function(callback) {
      var data = {
        user_id: req.session.user_id,
        offset: req.param('offset'),
        range: req.param('range')
      };

      models.document.list(data, function(error, result) {
        if(error) {
          callback(error);
          return;
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

          models.favorite.get(data, function(error, result) {
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
              count: result.count,
              is_favorite: result.is_favorite,
              is_owner: true
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
    res.send(JSON.stringify(result));
  });
};

/* random */
exports.random = function(req, res, next) {
  async.waterfall([
    function(callback) {
      var data = {
        range: req.param('range'),
        language_list: [],
        user_id: null
      };

      if(req.session.user_id) {
        data.user_id = req.session.user_id;
      }

      if(req.param('language_list')) {
        data.language_list = JSON.parse(req.param('language_list'));
      }

      models.document.random(data, function(error, result) {
        if(error) {
          callback(error);
          return;
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

          models.favorite.get(data, function(error, result) {
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
              count: result.count,
              is_favorite: result.is_favorite,
              is_owner: item.is_owner
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
    res.send(JSON.stringify(result));
  });
};

/* post */
exports.post = function(req, res, next) {
  var data = {
    user_id: req.session.user_id,
    title: req.param('title'),
    body: req.param('body'),
    language: 'unknown'
  };

  // encode
  data.title = TextPreprocessing.encode(data.title);
  data.body = TextPreprocessing.encode(data.body);
  data.language = TextPreprocessing.detectLanguage(data.body);

  models.document.post(data, function(error, result) {
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
    title: req.param('title'),
    body: req.param('body'),
    language: 'unknown'
  };

  data.title = TextPreprocessing.encode(data.title);
  data.body = TextPreprocessing.encode(data.body);
  data.language = TextPreprocessing.detectLanguage(data.body);

  models.document.edit(data, function(error, result) {
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
      models.document.remove(data, function(error, result) {
        if(error) {
          return callback(error);
        }
        callback(null);
      });
    },
    function(callback) {
      models.favorite.chain({_id: data._id}, function(error, result) {
        if(error) {
          return callback(error);
        }
        callback(null);
      });
    },
    function(callback) {
      models.view.remove({_id: data._id}, function(error, result) {
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
