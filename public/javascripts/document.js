/**
 * @fileoverview
 * app.js
 */

/** define */
var BASE_URL = 'https://pickmemo.net/instaword/'

/** global */
var g_group_id = $('#input_group_id').val();
var g_state = 'show_document';



AIRBRAIN.Instaword.document.initialize();
AIRBRAIN.Instaword.favorite.initialize();



if(g_group_id != '') {
  AIRBRAIN.Instaword.comment.get($('#input_document_id').val());

  $('#button_comment_post').bind('click', function(e) {
    AIRBRAIN.Instaword.comment.post(
      $('#input_document_id').val(),
      $('#input_comment_body').val()
    );
  });

  $('.comment_content').css('display', 'block');
}



/*
 * iOS
 */
var g_user_agent = navigator.userAgent;
if(g_user_agent.indexOf('iPhone') != -1) {
  $('.memo_show_foot_container').css('padding-top', '0px');
}
