/**
 * @fileoverview
 * AIRBRAIN-Instaword-Main
 */

/** namespace */
var AIRBRAIN;
if (!AIRBRAIN) AIRBRAIN = {};
if (!AIRBRAIN.Instaword) AIRBRAIN.Instaword = {};
if (!AIRBRAIN.Instaword.comment) AIRBRAIN.Instaword.comment = {};



/**
 * DOCUMENT
 */
AIRBRAIN.Instaword.Comment = (function() {

  /**
   * constructor
   */
  function Comment() {
  }

  /**
   * initialize
   */
  Comment.prototype.initialize = function() {
  }

  /**
   * post
   */
  Comment.prototype.post = function(target_id, body) {
    var this_object = this;

    var data = {
      body: body,
      target_id: target_id
    };

    var target_url = 'comments/post';

    $.ajax({
      type: 'POST',
      url: BASE_URL + target_url,
      data: data,
      success: function(result) {
        console.log(result);
        $('#input_comment_body').val('');
        AIRBRAIN.Instaword.view.resetComment();
        this_object.get(target_id);
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
      }
    });
  }

  /**
   * edit
   */
  Comment.prototype.edit = function(target_id) {
    var this_object = this;
    var data = {
      _id: $('#input_comment_id').val(),
      body: $('#input_comment_body').val()
    };

    var target_url = 'comments/edit';

    $.ajax({
      type: 'POST',
      url: BASE_URL + target_url,
      data: data,
      success: function(result) {
        console.log(result);
        $('#input_comment_body').val('');
        AIRBRAIN.Instaword.view.resetComment();
        this_object.get(target_id);
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
      }
    });
  }

  /**
   * remove
   */
  Comment.prototype.remove = function(_id, target_id) {
    var this_object = this;
    var data = {
      _id: _id
    };

    var target_url = 'comments/remove';

    $.ajax({
      type: 'POST',
      url: BASE_URL + target_url,
      data: data,
      success: function(result) {
        console.log(result);
        AIRBRAIN.Instaword.view.resetComment();
        this_object.get(target_id);
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
      }
    });
  }

  /**
   * get
   */
  Comment.prototype.get = function(target_id) {
    var this_object = this;
    var data = {
      target_id: target_id
    };

    var target_url = 'comments/get';

    AIRBRAIN.Instaword.view.resetComment();

    $.ajax({
      type: 'POST',
      url: BASE_URL + target_url,
      data: data,
      success: function(result) {
        result = JSON.parse(result);
        if(result.length > 0) {
          var count = 0;
          var limit = result.length;
          async.whilst(
            function() { return count < limit; },
            function(callback) {
              AIRBRAIN.Instaword.view.setComment(result[count], target_id);
              count++;
              callback(null);
            },
            function(error) {
              if(error) {
                alert(error);
              }
            }
          );

        }
        else
        {
          // last
        }
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
      }
    });
  }

  return Comment;
})();



/* set */
AIRBRAIN.Instaword.comment = new AIRBRAIN.Instaword.Comment();
