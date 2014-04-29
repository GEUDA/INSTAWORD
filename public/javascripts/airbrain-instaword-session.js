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
  }

  /**
   * update
   */
  Session.prototype.update = function() {
    if($('#password_change_modal_new_password').val() != $('#password_change_modal_new_password_again').val()) {
      alert('NEW PASSWORD and NEW PASSWORD(AGAIN) do not match.');
      return;
    }

    var this_object = this;
    var data = {
      password: $('#password_change_modal_old_password').val(),
      new_password: $('#password_change_modal_new_password').val()
    };

    $.ajax({
      type: 'POST',
      url: BASE_URL + 'sessions/update',
      data: data,
      success: function(result) {
        if(!result) {
          alert('PASSWORD do not match.');
          return;
        }
        $('#passowrd_change_modal_old_password').val('');
        $('#passowrd_change_modal_new_password').val('');
        $('#passowrd_change_modal_new_password_again').val('');
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
      }
    });
  }

  /**
   * Auth
   */
  Session.prototype.auth = function() {
    var data = {
      email_address: g_email_address,
      password: g_password
    };

    $.ajax({
      type: 'POST',
      url: BASE_URL + 'sessions/checkAuth',
      data: data,
      success: function(result) {
        console.log(result);
        if(!result) {
          // logout
        }
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
      }
    });
  }

  /**
   * logout
   */
  Session.prototype.logout = function() {
  }

  return Session;
})();



/* set */
AIRBRAIN.Instaword.session = new AIRBRAIN.Instaword.Session();
