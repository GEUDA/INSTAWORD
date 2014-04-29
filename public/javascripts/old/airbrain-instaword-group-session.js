/**
 * @fileoverview
 * AIRBRAIN-Instaword-Main
 */

/** namespace */
var AIRBRAIN;
if (!AIRBRAIN) AIRBRAIN = {};
if (!AIRBRAIN.Instaword) AIRBRAIN.Instaword = {};
if (!AIRBRAIN.Instaword.session) AIRBRAIN.Instaword.session = {};



/**
 * SESSION
 */
AIRBRAIN.Instaword.Session = (function() {

  /**
   * constructor
   */
  function Session() {
  }

  /**
   * initialize
   */
  Session.prototype.initialize = function() {
    $('.dynamic_content').remove();
  }

  /**
   * update
   */
  Session.prototype.update = function() {
    if($('#input_new_password').val() != $('#input_new_password_again').val()) {
      alert('NEW PASSWORD and NEW PASSWORD(AGAIN) do not match.');
      return;
    }

    var this_object = this;
    var data = {
      password: $('#input_password').val(),
      new_password: $('#input_new_password').val()
    };

    $.ajax({
      type: 'POST',
      url: './sessions/update',
      data: data,
      success: function(result) {
        if(!result) {
          alert('PASSWORD do not match.');
          return;
        }
        $('#input_password').val('');
        $('#input_new_password').val('');
        $('#input_new_password_again').val('');
        $('#password_modal').modal('hide');
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        document.location = BASE_URL;
      }
    });
  }

  /**
   * config
   */
  Session.prototype.config = function(list) {
    var this_object = this;
    var container = $('<div/>').attr('class', 'content_block table masonry dynamic_content');

    $('#wrap').masonry({
      columnWidth: 10,
      itemSelector: '.masonry',
      hiddenStyle: { opacity: 0, transform: 'scale(1)' },
      visibleStyle: { opacity: 1, transform: 'scale(1)' }
    });

    // user config
    var button_update = $('<button/>')
      .attr('class', 'btn btn-primary')
      .text('Change PASSWORD')
      .bind('click', function(e) {
        $('#password_modal').modal('show');
      });
    // filter config
    var button_language = $('<button/>')
      .attr('class', 'btn')
      .text('Language')
      .bind('click', function(e) {
      });
    // group config
    var button_group_invite = $('<button/>')
      .attr('id', 'button_group_invite')
      .attr('class', 'btn btn-primary')
      .text('Invite')
      .bind('click', function(e) {
        $('#group_invite_modal').modal('show');
      });
    var button_group_resign = $('<button/>')
      .attr('id', 'button_group_resign')
      .attr('class', 'btn btn-danger')
      .text('Resign')
      .bind('click', function(e) {
        $('#confirm_text').text('Are you sure you want to resign this group?');
        $('#button_confirm').bind('click', function(e) {
          AIRBRAIN.Instaword.group.remove();
        });
        $('#confirm_modal').modal('show');
      });

    var content = $('<div/>').attr('class', '')
      .append($('<h2/>').text('USER'))
      .append(button_update)
      .append($('<h2/>').text('FILTER (NOT IMPLEMENTED)'))
      .append(button_language)
      .append($('<h2/>').text('GROUP'))
      .append(button_group_invite)
      .append(button_group_resign)
      ;

    container.append(content);

    $('#wrap').append(container).masonry('appended', container);

    // group
    AIRBRAIN.Instaword.group.get();
  }

  return Session;
})();



/* set */
AIRBRAIN.Instaword.session = new AIRBRAIN.Instaword.Session();
