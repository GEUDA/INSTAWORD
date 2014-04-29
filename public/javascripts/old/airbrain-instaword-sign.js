/**
 * @fileoverview
 * AIRBRAIN-Instaword-Main
 */

/** namespace */
var AIRBRAIN;
if (!AIRBRAIN) AIRBRAIN = {};
if (!AIRBRAIN.Instaword) AIRBRAIN.Instaword = {};
if (!AIRBRAIN.Instaword.sign) AIRBRAIN.Instaword.sign = {};



/**
 * SESSION
 */
AIRBRAIN.Instaword.Sign = (function() {

  /**
   * constructor
   */
  function Sign() {
  }

  /**
   * initialize
   */
  Sign.prototype.initialize = function() {
  }

  /**
   * check
   */
  Sign.prototype.check = function() {
    if($('#input_password').val() != $('#input_password_again').val()) {
      alert('PASSWORD and PASSWORD(AGAIN) do not match.');
      return;
    }

    var data = {
      email_address: $('#input_email_address').val()
    };

    $.ajax({
      type: 'POST',
      url: './sessions/checkEmail',
      data: data,
      success: function(result) {
        if(!result) {
          alert('This EMAIL ADDRESS can not use.');
          $('#input_submit').attr('disabled', 'disabled');
          return;
        }
        $('#input_submit').removeAttr('disabled');
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        document.location = '/instaword/';
      }
    });
  }

  return Sign;
})();



/* set */
AIRBRAIN.Instaword.sign = new AIRBRAIN.Instaword.Sign();

$('#input_check').bind('click', function(e) {
  AIRBRAIN.Instaword.sign.check();
});
