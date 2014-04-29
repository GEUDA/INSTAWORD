// Route-Middleware
var models = require('../models')
  ;



exports.groupMemberRequired = function(req, res, next) {
  var data = {
    _id: req.param('group_id'),
    user_id: req.session.user_id
  }

  models.group.check(data, function(error, result) {
    if(error) {
      return next(error);
    }

    if(result) {
      next();
    }
    else
    {
      res.status(403);
    }
  });
};



exports.groupMemberRejector = function(req, res, next) {
  var data = {
    _id: req.param('group_id'),
    user_id: req.session.user_id
  }

  models.group.check(data, function(error, result) {
    if(error) {
      return next(error);
    }

    if(!result) {
      next();
    }
    else
    {
      res.status(403);
    }
  });
};
