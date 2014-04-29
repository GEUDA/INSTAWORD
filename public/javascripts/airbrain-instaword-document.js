/**
 * @fileoverview
 * AIRBRAIN-Instaword-Main
 */

/** namespace */
var AIRBRAIN;
if (!AIRBRAIN) AIRBRAIN = {};
if (!AIRBRAIN.Instaword) AIRBRAIN.Instaword = {};
if (!AIRBRAIN.Instaword.document) AIRBRAIN.Instaword.document = {};



/**
 * DOCUMENT
 */
AIRBRAIN.Instaword.Document = (function() {

  /**
   * constructor
   */
  function Document() {
    this.document_list = [];
    this.offset = 0;
    this.range = 32;
    this.state = 'loading';
  }

  /**
   * initialize
   */
  Document.prototype.initialize = function() {
    this.document_list = [];
    this.offset = 0;
  }

  /**
   * post
   */
  Document.prototype.post = function() {
    var this_object = this;

    var data = {
      title: $('#memo_post_modal_title').val(),
      body: $('#memo_post_modal_body').val()
    };

    var target_url = 'documents/post';
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
        $('#input_title').val('');
        $('#input_body').val('');
        AIRBRAIN.Instaword.view.initialize();
        this_object.initialize();
        this_object.random();
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
      }
    });
  }

  /**
   * edit
   */
  Document.prototype.edit = function() {
    var this_object = this;
    var data = {
      _id: $('#memo_post_modal_id').val(),
      title: $('#memo_post_modal_title').val(),
      body: $('#memo_post_modal_body').val()
    };

    var target_url = 'documents/edit';
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
        AIRBRAIN.Instaword.view.initialize();
        this_object.initialize();
        this_object.random();
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
      }
    });
  }

  /**
   * remove
   */
  Document.prototype.remove = function(target_id) {
    var this_object = this;
    var data = {
      _id: target_id
    };

    var target_url = 'documents/remove';
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
        AIRBRAIN.Instaword.view.initialize();
        this_object.initialize();
        this_object.random();
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
      }
    });
  }

  /**
   * random
   */
  Document.prototype.random = function() {
    var this_object = this;
    var data = {
      range: this.range
    };

    g_state = 'random';

    var target_url = 'documents/random';
    if(g_group_id != '') {
      data.group_id = g_group_id;
      target_url = 'groups/' + target_url;
    }

    this_object.initialize();
    AIRBRAIN.Instaword.view.removeContent();
    AIRBRAIN.Instaword.view.showLoading();

    $.ajax({
      type: 'POST',
      url: BASE_URL + target_url,
      data: data,
      success: function(result) {
        result = JSON.parse(result);
        AIRBRAIN.Instaword.view.hideLoading();
        $(window).unbind("scroll");

        var group_id = g_group_id;

        var count = 0;
        var limit = result.length;
        async.whilst(
          function() { return count < limit && g_group_id + g_state == group_id + 'random'; },
          function(callback) {
            this_object.keyword(result[count], group_id + 'random', callback);
            count++;
          },
          function(error) {
            if(error) {
              alert(error);
            }
          }
        );
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
      }
    });
  }

  /**
   * list
   */
  Document.prototype.list = function() {
    var this_object = this;
    var data = {
      offset: this.offset,
      range: this.range
    };

    g_state = 'owner';

    var target_url = 'documents/list';
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
          this_object.offset += result.length;
          AIRBRAIN.Instaword.view.hideLoading();

          var group_id = g_group_id;

          var count = 0;
          var limit = result.length;
          async.whilst(
            function() { return count < limit && g_group_id + g_state == group_id + 'owner'; },
            function(callback) {
              this_object.keyword(result[count], group_id + 'owner', callback);
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
          // last
          AIRBRAIN.Instaword.view.hideLoading();
          $(window).unbind("scroll");
        }
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
      }
    });
  }

  /**
   * timeline
   */
  Document.prototype.timeline = function() {
    var this_object = this;
    var data = {
      offset: this.offset,
      range: this.range
    };

    g_state = 'timeline';

    var target_url = 'documents/timeline';
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
          this_object.offset += result.length;
          AIRBRAIN.Instaword.view.hideLoading();

          var group_id = g_group_id;

          var count = 0;
          var limit = result.length;
          async.whilst(
            function() { return count < limit && g_group_id + g_state == group_id + 'timeline'; },
            function(callback) {
              this_object.keyword(result[count], group_id + 'timeline', callback);
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
                  this_object.timeline();
                }
              });
            }
          );

        }
        else
        {
          // last
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
  Document.prototype.keyword = function(item, state, callback) {
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

  /**
   * setRead
   */
  Document.prototype.setRead = function(id) {
    var this_object = this;
    var data = {
      _id: id
    };

    var target_url = 'views/set';

    $.ajax({
      type: 'POST',
      url: BASE_URL + target_url,
      data: data,
      success: function(result) {
        console.log(result)
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        console.log(errorThrown);
      }
    });
  }

  return Document;
})();



/* set */
AIRBRAIN.Instaword.document = new AIRBRAIN.Instaword.Document();
