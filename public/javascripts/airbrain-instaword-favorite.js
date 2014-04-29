/**
 * @fileoverview
 * AIRBRAIN-Instaword-Main
 */

/** namespace */
var AIRBRAIN;
if (!AIRBRAIN) AIRBRAIN = {};
if (!AIRBRAIN.Instaword) AIRBRAIN.Instaword = {};
if (!AIRBRAIN.Instaword.favorite) AIRBRAIN.Instaword.favorite = {};



/**
 * DOCUMENT
 */
AIRBRAIN.Instaword.Favorite = (function() {

  /**
   * constructor
   */
  function Favorite() {
    this.document_list = [];
    this.offset = 0;
    this.range = 32;
  }

  /**
   * initialize
   */
  Favorite.prototype.initialize = function() {
    this.document_list = [];
    this.offset = 0;
  }

  /**
   * set
   */
  Favorite.prototype.set = function(target_id) {
    var this_object = this;
    var data = {
      _id: target_id
    };

    var target_url = 'favorites/set';
    if(g_group_id != '') {
      data.group_id = g_group_id;
      target_url = 'groups/' + target_url;
    }

    $.ajax({
      type: 'POST',
      url: BASE_URL + target_url,
      data: data,
      success: function(result) {
        console.log(result);
        $('#show_modal').modal('hide');
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
      }
    });
  }

  /**
   * remove
   */
  Favorite.prototype.remove = function(target_id) {
    var this_object = this;
    var data = {
      _id: target_id
    };

    var target_url = 'favorites/remove';
    if(g_group_id != '') {
      data.group_id = g_group_id;
      target_url = 'groups/' + target_url;
    }

    $.ajax({
      type: 'POST',
      url: BASE_URL + target_url,
      data: data,
      success: function(result) {
        console.log(result);
        $('#show_modal').modal('hide');
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
      }
    });
  }

  /**
   * list
   */
  Favorite.prototype.list = function() {
    var this_object = this;
    var data = {
      offset: this.offset,
      range: this.range
    };

    g_state = 'favorite';

    var target_url = 'favorites/list';
    if(g_group_id != '') {
      data.group_id = g_group_id;
      target_url = 'groups/' + target_url;
    }

    $(window).unbind("scroll");
    AIRBRAIN.Instaword.view.showLoading();

    $.ajax({
      type: 'POST',
      url: BASE_URL + target_url,
      data: data,
      success: function(result) {
        $('.next').remove();
        result = JSON.parse(result);
        if(result.length > 0) {
          this_object.offset += result.length + 1;
          AIRBRAIN.Instaword.view.hideLoading();

          var group_id = g_group_id;

          var count = 0;
          var limit = result.length;
          async.whilst(
            function() { return count < limit && g_group_id + g_state == group_id + 'favorite'; },
            function(callback) {
              this_object.keyword(result[count], group_id + 'favorite', callback);
              count++;
            },
            function(error) {
              if(error) {
                alert(error);
              }
              $(window).bind("scroll", function() {
                scrollHeight = $(document).height();
                scrollPosition = $(window).height() + $(window).scrollTop();
                if ( (scrollHeight - scrollPosition) / scrollHeight <= 0.05) {
                  this_object.list();
                }
              });
            }
          );
        }
        else
        {
          // end
          AIRBRAIN.Instaword.view.hideLoading();
          $(window).unbind("scroll");
        }
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
      }
    });
  }

  /**
   * keyword
   */
  Favorite.prototype.keyword = function(item, state, callback) {
    var this_object = this;
    var data = {
      text: $('<div/>').html(item.body.replace(/<br \/>/g, '\n')).text()
    };

    var target_url = 'words/get';

    $.ajax({
      type: 'POST',
      url: BASE_URL + target_url,
      data: data,
      success: function(result) {
        if(state != g_group_id + g_state) {
          return callback(null);
        }

        item.is_new = false;

        result = JSON.parse(result);
        item.keyword = result.body;
        this_object.document_list.push(item);

        AIRBRAIN.Instaword.view.setCardList(item);

        callback(null);
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        callback(errorThrown);
      }
    });
  }

  return Favorite;
})();



/* set */
AIRBRAIN.Instaword.favorite = new AIRBRAIN.Instaword.Favorite();
