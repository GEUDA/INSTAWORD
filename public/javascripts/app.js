/**
 * @fileoverview
 * app.js
 */

/** define */
var BASE_URL = ''; //'https://pickmemo.net/instaword/'

/** global */
var g_group_id = '';
var g_button_config = false;
var g_state = 'boot';


/* 既読管理移行 */
var g_is_set_read_list = false;
if(window.localStorage) {
  g_is_set_read_list = window.localStorage.getItem('is_set_read_list');
}

if(window.localStorage && !g_is_set_read_list) {
  var g_read_list = JSON.parse(window.localStorage.getItem('read_list'));

  _.each(g_read_list, function(item) {
    AIRBRAIN.Instaword.document.setRead(item);
  });

  try {
    window.localStorage.setItem('is_set_read_list', true);
  }
  catch(e) {
    console.log(e);
  }
}



AIRBRAIN.Instaword.document.initialize();
AIRBRAIN.Instaword.favorite.initialize();
AIRBRAIN.Instaword.view.initialize();
AIRBRAIN.Instaword.document.random();



/* MAIN HEADER */
$('#button_title').bind('click', function(e) {
  location.href = BASE_URL;
});

$('#button_reload').bind('click', function(e) {
  AIRBRAIN.Instaword.document.random();
});

$('#button_config').bind('click', function(e) {
  AIRBRAIN.Instaword.view.switchMenu();
});



/* MENU HEADER */
$('#button_group').bind('click', function(e) {
  AIRBRAIN.Instaword.group.list();
  AIRBRAIN.Instaword.view.showGroupSelect();
});

$('#button_group_create').bind('click', function(e) {
  AIRBRAIN.Instaword.view.showGroupCreate();
});



/* GROUP MENU */
$('#button_group_invite').bind('click', function(e) {
  AIRBRAIN.Instaword.view.hideShade();
  AIRBRAIN.Instaword.group.invite();
});

$('#button_group_resign').bind('click', function(e) {
  AIRBRAIN.Instaword.view.hideShade();
  AIRBRAIN.Instaword.view.showGroupResign();
});

$('#button_password_change').bind('click', function(e) {
  AIRBRAIN.Instaword.view.hideShade();
  AIRBRAIN.Instaword.view.showPasswordChange();
});



/* TOP ICON */
$('#button_memo').bind('click', function(e) {
  AIRBRAIN.Instaword.view.showMemoPost();
  $('#memo_post_modal_title').val('');
  $('#memo_post_modal_body').val('');
  $('#memo_post_modal_id').val('');
  $('#button_memo_post_modal_post').unbind();
  $('#button_memo_post_modal_post').bind('click', function(e) {
    AIRBRAIN.Instaword.document.post();
  });
});

$('#button_random').bind('click', function(e) {
  AIRBRAIN.Instaword.document.initialize();
  AIRBRAIN.Instaword.favorite.initialize();
  AIRBRAIN.Instaword.document.random();
});

$('#button_favorite').bind('click', function(e) {
  AIRBRAIN.Instaword.view.removeContent();
  AIRBRAIN.Instaword.favorite.initialize();
  AIRBRAIN.Instaword.favorite.list();
});

$('#button_owner').bind('click', function(e) {
  AIRBRAIN.Instaword.view.removeContent();
  AIRBRAIN.Instaword.document.initialize();
  AIRBRAIN.Instaword.document.list();
});



/* MODAL */
$('#button_modal_close').bind('click', function(e) {
  AIRBRAIN.Instaword.view.hideShade();
});

$('#shade').bind('click', function(e) {
  AIRBRAIN.Instaword.view.hideShade();
});

/* GROUP MODAL */
$('#button_group_create_modal_post').bind('click', function(e) {
  AIRBRAIN.Instaword.group.create();
  AIRBRAIN.Instaword.view.hideShade();
});

$('#button_group_resign_modal_post').bind('click', function(e) {
  AIRBRAIN.Instaword.group.remove();
  AIRBRAIN.Instaword.view.hideShade();
});

/* PASSWORD CHANGE MODAL */
$('#button_password_change_modal_post').bind('click', function(e) {
  AIRBRAIN.Instaword.session.update();
  AIRBRAIN.Instaword.view.hideShade();
});



/* OTHER */
$('#button_timeline').bind('click', function(e) {
  AIRBRAIN.Instaword.view.removeContent();
  AIRBRAIN.Instaword.document.initialize();
  AIRBRAIN.Instaword.document.timeline();
  AIRBRAIN.Instaword.view.hideMenu();
});



/*
 * iOS
 */
var g_user_agent = navigator.userAgent;
if(g_user_agent.indexOf('iPhone') != -1) {
  $('.modal_foot_container').css('padding-top', '0px');
}
