
/*
 * GET home page.
 */

var _ = require('underscore')
  , async = require('async')
  , request = require('request').defaults({ encoding: null })
  , validator = require('validator')
  , lib = require('../../lib')
  ;



var base_url = 'https://pickmemo.net';



exports.condense = function(data, callback) {
  var data = {
    text: data.text
  };

  async.waterfall([
    function(callback) {
      var option = {
        url: base_url + '/condense',
        form: data,
        json: true,
        rejectUnauthorized: false
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
        url: base_url + '/condense',
        form: data,
        json: true,
        rejectUnauthorized: false
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
