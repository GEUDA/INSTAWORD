
/*
 * GET home page.
 */

exports.index = function(req, res){
  if(req.session.user_id) {
    return res.render('index', { title: 'Instaword' });
  }
  else
  {
    return res.render('about', { title: 'Instaword' });
  }
};

exports.about = function(req, res) {
  return res.render('about', { title: 'Instaword' });
};



exports.sessions = require('./sessions');
exports.documents = require('./documents');
exports.favorites = require('./favorites');
exports.groups = require('./groups');
exports.words = require('./words');
exports.views = require('./views');
exports.comments = require('./comments');
