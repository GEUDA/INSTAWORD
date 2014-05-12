
/*
 * GET home page.
 */

exports.index = function(req, res){
  if(req.session.user_id) {
    return res.render('index', { title: 'AGASTYA' });
  }
  else
  {
    return res.render('about', { title: 'AGASTYA' });
  }
};

exports.about = function(req, res) {
  return res.render('about', { title: 'AGASTYA' });
};



exports.sessions = require('./sessions');
exports.documents = require('./documents');
exports.favorites = require('./favorites');
exports.groups = require('./groups');
exports.words = require('./words');
exports.views = require('./views');
exports.comments = require('./comments');
