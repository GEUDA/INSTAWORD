/**
 * @fileoverview
 * app.js
 */

/** define */
var CHECK_POSITION_INTERVAL = 100;
var BASE_URL = '/instaword/';



/**
 * Button
 */
$('#nav_memo').bind('click', function(e) {
  // post
  $('#post_modal').modal('show');
});

$('#nav_random').bind('click', function(e) {
  // clear
  AIRBRAIN.Instaword.document.initialize();
  // get random
  // put
  AIRBRAIN.Instaword.document.random();
});

$('#nav_list').bind('click', function(e) {
  // clear
  AIRBRAIN.Instaword.document.initialize();
  // get list
  // put
  AIRBRAIN.Instaword.document.list();
});

$('#nav_favorite').bind('click', function(e) {
  // clear
  AIRBRAIN.Instaword.favorite.initialize();
  // get list
  // put
  AIRBRAIN.Instaword.favorite.list();
});

$('#nav_config').bind('click', function(e) {
  // clear
  AIRBRAIN.Instaword.session.initialize();
  // put
  AIRBRAIN.Instaword.session.config();
});

$('#nav_logout').bind('click', function(e) {
  document.location = './sessions/logout';
});



$('#button_post').bind('click', function(e) {
  AIRBRAIN.Instaword.document.post();
  $('#post_modal').modal('hide');
});

$('#button_edit').bind('click', function(e) {
  AIRBRAIN.Instaword.document.edit();
  $('#edit_modal').modal('hide');
});

$('#button_password').bind('click', function(e) {
  AIRBRAIN.Instaword.session.update();
});

$('#button_group_create_send').bind('click', function(e) {
  AIRBRAIN.Instaword.group.create();
});



/* 初期化 */
AIRBRAIN.Instaword.document.initialize();
AIRBRAIN.Instaword.document.random();
