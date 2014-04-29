
/*
 * GET home page.
 */

var _ = require('underscore')
  , async = require('async')
  , request = require('request').defaults({ encoding: null })
  , validator = require('validator')
  , lib = require('../../lib')
  ;



exports.condense = function(data, callback) {
  var data = {
    text: data.text
  };

  async.waterfall([
    function(callback) {
      var option = {
        url: 'http://127.0.0.1:55000/condense',
        form: data,
        json: true
      };
      request.post(option, function(error, response, body) {
        if(error) {
          callback(error);
        }

        callback(null, body);
      });
    }
  ],
  function(error, result) {
    if(error) {
      return callback(error);
    }

    // validate
    /*
    for(var i = 0; i < result.body.length; i++) {
      result.body[i].word = validator.escape(result.body[i].word);
    }
    for(var i = 0; i < result.matter.length; i++) {
      result.matter[i].word = validator.escape(result.matter[i].word);
    }
    */

    return callback(null, result);
  });
};



exports.get = function(req, res, next) {
  var data = {
    text: req.param('text')
  };

  async.waterfall([
    function(callback) {
      var option = {
        url: 'http://127.0.0.1:55000/condense',
        form: data,
        json: true
      };
      request.post(option, function(error, response, body) {
        if(error) {
          callback(error);
        }

        callback(null, body);
      });
    }
  ],
  function(error, result) {
    if(error) {
      return next(error);
    }

    // validate
    /*
    for(var i = 0; i < result.body.length; i++) {
      result.body[i].word = validator.escape(result.body[i].word);
    }
    for(var i = 0; i < result.matter.length; i++) {
      result.matter[i].word = validator.escape(result.matter[i].word);
    }
    */

    return res.send(JSON.stringify(result));
  });
};
