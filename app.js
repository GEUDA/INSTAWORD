
/**
 * Module dependencies.
 */

var express = require('express');
var partials = require('express-partials');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var flash = require('connect-flash');

var model = require('./models');
var lib = require('./lib');

var app = express();

// all environments
app.set('port', process.env.PORT || 3001);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(function(req, res, next) {
  req.url = req.url.replace(/^\/instaword\/*/, '/');
  next();
});

app.use(partials());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('m2linnae_instaword'));
app.use(express.session({
  secret: 'm2linnae_instaword',
  cookie: {
    maxAge: false
  }
}));
app.use(flash());
app.configure(function() {
  //app.use(lib.helpers);
  //app.use(lib.dynamicHelpers);
});
app.use(app.router);

app.use(function(req, res, next) {
  req.url = '/instaword' + req.url;
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

// development
if ('development' == app.get('env')) {
  model.init('localhost', 'instaword_dev');
  app.use(express.errorHandler());
}
// production
if ('production' == app.get('env')) {
  model.init('localhost', 'instaword_pro');
  app.use(express.errorHandler());
}



// 表示
app.get('/', routes.index);
app.get('/about', routes.about);

// 操作
app.post('/documents/get', lib.loginRequiredPost, routes.documents.get); // post
app.post('/documents/list', lib.loginRequiredPost, routes.documents.list); // list
app.post('/documents/timeline', lib.loginRequiredPost, routes.documents.timeline); // list
app.post('/documents/random', lib.loginChecker, routes.documents.random); // random
app.post('/documents/post', lib.loginRequiredPost, routes.documents.post); // post
app.post('/documents/edit', lib.loginRequiredPost, routes.documents.edit); // edit
app.post('/documents/remove', lib.loginRequiredPost, routes.documents.remove); // remove

// お気に入り
app.post('/favorites/list', lib.loginRequiredPost, routes.favorites.list); // get
app.post('/favorites/set', lib.loginRequiredPost, routes.favorites.set); // set
app.post('/favorites/remove', lib.loginRequiredPost, routes.favorites.remove); // remove

// グループ
app.post('/groups/get', lib.loginRequiredPost, lib.groupMemberRequired, routes.groups.get); // get
app.post('/groups/list', lib.loginRequiredPost, routes.groups.list); // list
app.post('/groups/invite', lib.loginRequiredPost, lib.groupMemberRequired, routes.groups.invite); // invite
app.post('/groups/create', lib.loginRequiredPost, routes.groups.create); // create
app.get('/groups/register/:token', lib.loginRequired, routes.groups.register); // register
app.post('/groups/remove', lib.loginRequiredPost, lib.groupMemberRequired, routes.groups.remove); // remove
app.post('/groups/delete', lib.loginRequiredPost, lib.groupMemberRequired, routes.groups.delete); // delete
app.get('/groups/view/:group_id', lib.loginRequired, lib.groupMemberRequired, routes.groups.view); // view
app.post('/groups/documents/random', lib.loginRequiredPost, lib.groupMemberRequired, routes.groups.documents.random); // random
app.post('/groups/documents/list', lib.loginRequiredPost, lib.groupMemberRequired, routes.groups.documents.list); // list
app.post('/groups/documents/timeline', lib.loginRequiredPost, lib.groupMemberRequired, routes.groups.documents.timeline); // list
app.post('/groups/documents/post', lib.loginRequiredPost, lib.groupMemberRequired, routes.groups.documents.post); // post
app.post('/groups/documents/edit', lib.loginRequiredPost, routes.groups.documents.edit); // edit
app.post('/groups/documents/remove', lib.loginRequiredPost, routes.groups.documents.remove); // remove
app.post('/groups/favorites/list', lib.loginRequiredPost, lib.groupMemberRequired, routes.groups.favorites.list); // list
app.post('/groups/favorites/set', lib.loginRequiredPost, lib.groupMemberRequired, routes.groups.favorites.set); // set
app.post('/groups/favorites/remove', lib.loginRequiredPost, routes.groups.favorites.remove); // remove

//  キーワード
app.post('/words/get', lib.loginRequiredPost, routes.words.get);

// 既読
app.post('/views/set', lib.loginRequiredPost, routes.views.set);

// 認証
app.get('/sessions/login', routes.sessions.login); // sign in
app.post('/sessions/auth', routes.sessions.auth); // sign in
app.get('/sessions/sign', routes.sessions.sign); // sign up
app.post('/sessions/create', routes.sessions.create); // sign up
app.get('/sessions/register/:token', routes.sessions.register); // confirm
app.post('/sessions/update', routes.sessions.update); // change password
app.get('/sessions/logout', routes.sessions.logout); // logout
app.get('/sessions/resign', lib.loginRequired, routes.sessions.resign); // remove
app.post('/sessions/delete', lib.loginRequiredPost, routes.sessions.delete); // remove
app.post('/sessions/checkEmail', routes.sessions.checkEmail); // email check
// スマートフォン向け
app.post('/sessions/checkAuth', routes.sessions.checkAuth); // sign in
app.post('/sessions/getToken', lib.loginMakeToken, routes.sessions.getToken); // sign in



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
