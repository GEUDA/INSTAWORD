/**
 * @fileoverview
 * AIRBRAIN-Instaword-View
 */

/** namespace */
var AIRBRAIN;
if (!AIRBRAIN) AIRBRAIN = {};
if (!AIRBRAIN.Instaword) AIRBRAIN.Instaword = {};
if (!AIRBRAIN.Instaword.view) AIRBRAIN.Instaword.view = {};



/**
 * VIEW
 */
AIRBRAIN.Instaword.View = (function() {

  /**
   * constructor
   */
  function View() {
    this.button_menu_state = false;
    this.modal_state = 'none';
  }

  /**
   * initialize
   */
  View.prototype.initialize = function() {
    $('.dynamic_content').remove();
    this.button_menu_state = true;
    this.modal_state = 'none';

    this.switchMenu();
    this.hideMenu();
    this.hideShade();
    this.hideLoading();

    $('body').css('overflow', 'auto');
  }

  /**
   * removeContent
   */
  View.prototype.removeContent = function() {
    $('.dynamic_content').remove();
  }

  /**
   * control
   */
  View.prototype.switchMenu = function() {
    if(this.button_menu_state) {
      this.hideMenu();
    }
    else
    {
      this.showMenu();
    }
  }
  View.prototype.showMenu = function() {
    $('#button_config').css('color', '#ffffff');
    $('#menu_header').css('display', 'block');
    this.button_menu_state = true;
/*
    $('#menu_header').animate({
      display: 'block'
    }, 500);
*/
  }
  View.prototype.hideMenu = function() {
    $('#button_config').css('color', '#24ade0');
    $('#menu_header').css('display', 'none');
    this.button_menu_state = false;
/*
    $('#menu_header').animate({
      display: 'none'
    }, 500);
*/
  }

  View.prototype.showGroupHeader = function() {
    $('#group_header').css('display', 'block');
  }
  View.prototype.hideGroupHeader = function() {
    $('#group_header').css('display', 'block');
  }

  View.prototype.showMemoDetail = function() {
    $('#memo_show_modal').css('display', 'block');
    $('#shade').css('display', 'block');
    $('#modal_container').css('display', 'block');
    $('body').css('overflow', 'hidden');
    this.modal_state = 'detail';
  }

  View.prototype.showMemoPost = function() {
    $('#memo_post_modal').css('display', 'block');
    $('#shade').css('display', 'block');
    $('#modal_container').css('display', 'block');
    $('body').css('overflow', 'hidden');
    this.modal_state = 'edit';
  }

  View.prototype.showMemoRemove = function() {
    $('#memo_remove_modal').css('display', 'block');
    $('#shade').css('display', 'block');
    $('#modal_container').css('display', 'block');
    $('body').css('overflow', 'hidden');
    this.modal_state = 'remove';
  }

  View.prototype.showGroupSelect = function() {
    if(g_group_id == '') {
      $('#button_group_create').css('display', 'inline');
      $('#button_group_invite').css('display', 'none');
      $('#button_group_resign').css('display', 'none');
    }
    else
    {
      $('#button_group_create').css('display', 'none');
      $('#button_group_invite').css('display', 'inline');
      $('#button_group_resign').css('display', 'inline');
    }
    $('#group_select_modal').css('display', 'block');
    $('#shade').css('display', 'block');
    $('#modal_container').css('display', 'block');
    $('body').css('overflow', 'hidden');
    this.modal_state = 'group';
  }

  View.prototype.showGroupCreate = function() {
    $('#group_create_modal').css('display', 'block');
    $('#shade').css('display', 'block');
    $('#modal_container').css('display', 'block');
    $('body').css('overflow', 'hidden');
    this.modal_state = 'group';
  }

  View.prototype.showGroupInvite = function(data) {
    $('#group_invite_modal').css('display', 'block');
    $('#shade').css('display', 'block');
    $('#modal_container').css('display', 'block');
    $('body').css('overflow', 'hidden');
    this.modal_state = 'group';

    $('#group_invite_modal_group_name').text(data.group_name);
    $('#group_invite_modal_url').text(data.url);
  }

  View.prototype.showGroupResign = function() {
    $('#group_resign_modal').css('display', 'block');
    $('#shade').css('display', 'block');
    $('#modal_container').css('display', 'block');
    $('body').css('overflow', 'hidden');
    this.modal_state = 'group';
  }

  View.prototype.showConfirm = function() {
    $('#confirm_modal').css('display', 'block');
    $('#shade').css('display', 'block');
    $('#modal_container').css('display', 'block');
    $('body').css('overflow', 'hidden');
    this.modal_state = 'group';
  }

  View.prototype.showPasswordChange = function() {
    $('#password_change_modal').css('display', 'block');
    $('#shade').css('display', 'block');
    $('#modal_container').css('display', 'block');
    $('body').css('overflow', 'hidden');
    this.modal_state = 'group';
  }

  View.prototype.hideShade = function() {
    $('#memo_show_modal').css('display', 'none');
    $('#memo_post_modal').css('display', 'none');
    $('#memo_remove_modal').css('display', 'none');
    $('#group_select_modal').css('display', 'none');
    $('#group_create_modal').css('display', 'none');
    $('#group_invite_modal').css('display', 'none');
    $('#group_resign_modal').css('display', 'none');
    $('#password_change_modal').css('display', 'none');
    $('#confirm_modal').css('display', 'none');
    $('#shade').css('display', 'none');
    $('#modal_container').css('display', 'none');
    $('body').css('overflow', 'auto');
    this.modal_state = 'none';
  }



  View.prototype.showLoading = function() {
    $('body').css('overflow', 'hidden');
    $('#loading').css('display', 'block');
  }
  View.prototype.hideLoading = function() {
    $('body').css('overflow', 'auto');
    $('#loading').css('display', 'none');
  }



  View.prototype.showMemoList = function() {
    $('#memo_list_container').css('display', 'block');
  }
  View.prototype.hideMemoList = function() {
    $('#memo_list_container').css('display', 'none');
  }



  /**
   * set
   */
  View.prototype.setDetail = function(item) {
    var this_object = this;
    item.body = item.body.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    item.body = item.body.replace(/\n/g, '<br />');

    var dd;
    dd  = new Date(item.updated_at);
    var u_time = dd.getFullYear()
      + '.' + (dd.getMonth() + 1)
      + '.' + dd.getDate();

    if(g_group_id == '') {
      $('.comment_content').css('display', 'none');
    }
    else
    {
      $('.comment_content').css('display', 'block');
    }

    var body_text = item.body;
    if(g_group_id != '') {
      body_text = body_text.replace(/https?:\/\/[a-zA-Z0-9\-_\.:@!~*'\(¥);/?&=\+$,%#]+/g, function(url) {
        return '<a href="' + url + '" target="_brank">' + url + '</a>';
      });
    }

    $('#memo_show_modal_title').html(item.title);
    $('#memo_show_modal_body').html(body_text);
    $('#memo_show_modal_updated').html(u_time);

    /* owner */
    if(item.is_owner) {
      $('#button_memo_show_modal_edit').css('display', 'inline');
      $('#button_memo_show_modal_remove').css('display', 'inline');
      $('#button_memo_show_modal_edit').unbind();
      $('#button_memo_show_modal_edit').bind('click', function(e) {
        $('#memo_post_modal_id').val(item._id);
        $('#memo_post_modal_title').val(item.title);
        $('#memo_post_modal_body').val($('<div/>').html(item.body.replace(/<br \/>/g, '\n')).text());
        $('#button_memo_post_modal_post').unbind();
        $('#button_memo_post_modal_post').bind('click', function(e) {
          AIRBRAIN.Instaword.document.edit();
        });
        this_object.hideShade();
        this_object.showMemoPost();
      });
      $('#button_memo_show_modal_remove').unbind();
      $('#button_memo_show_modal_remove').bind('click', function(e) {
        $('#button_memo_remove_modal_post').unbind();
        $('#button_memo_remove_modal_post').bind('click', function(e) {
          AIRBRAIN.Instaword.document.remove(item._id);
          this_object.hideShade();
        });
        this_object.hideShade();
        this_object.showMemoRemove();
      });
    }
    else
    {
      $('#button_memo_show_modal_edit').css('display', 'none');
      $('#button_memo_show_modal_remove').css('display', 'none');
    }

    /* favorite */
    if(item.is_favorite) {
      $('#button_memo_show_modal_unfavorite').css('display', 'none');
      $('#button_memo_show_modal_favorite').css('display', 'inline');
      $('#button_memo_show_modal_favorite').unbind();
      $('#button_memo_show_modal_favorite').bind('click', function(e) {
        AIRBRAIN.Instaword.favorite.remove(item._id);
        $('#button_memo_show_modal_favorite').css('display', 'none');
        $('#button_memo_show_modal_unfavorite').css('display', 'inline');
      });
    }
    else
    {
      $('#button_memo_show_modal_favorite').css('display', 'none');
      $('#button_memo_show_modal_unfavorite').css('display', 'inline');
      $('#button_memo_show_modal_unfavorite').unbind();
      $('#button_memo_show_modal_unfavorite').bind('click', function(e) {
        AIRBRAIN.Instaword.favorite.set(item._id);
        $('#button_memo_show_modal_unfavorite').css('display', 'none');
        $('#button_memo_show_modal_favorite').css('display', 'inline');
      });
    }

    /* comment */
    $('#input_comment_target_id').val(item._id);
    $('#button_comment_post').unbind();
    $('#button_comment_post').bind('click', function(e) {
      AIRBRAIN.Instaword.comment.post(item._id, $('#input_comment_body').val());
    });
  }

  View.prototype.resetComment = function() {
    $('#comment_container').empty();
  }

  View.prototype.setComment = function(item, target_id) {
    var this_object = this;
    item.body = item.body.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    item.body = item.body.replace(/\n/g, '<br />');

    var container = $('#comment_container');

    var comment = $('<p />')
      .html(item.body);

    container.append(comment);

    // TODO button for owner
    if(item.is_owner) {
      var remove = $('<span />')
        .attr('class', 'button')
        .text('削除')
        .bind('click', function(e) {
          AIRBRAIN.Instaword.comment.remove(item._id, target_id);
        });
      container.append(remove);
    }

  }

  View.prototype.setCardList = function(item) {
    var this_object = this;
    this.modal_state = 'none';

    var container = $('#memo_list_container');

    var title_text = item.title;
    if(item.title.length > 23) {
      title_text = title_text.substring(0, 23) + '...';
    }

    /* control */
    var button_container = $('<div/>').attr('class', 'card_memo_button_container');

    /* owner */
    if(item.is_owner) {
      var button_remove = $('<div/>')
        .attr('class', 'button card_memo_remove_button')
        .bind('click', function(e) {
          $('#button_memo_remove_modal_post').unbind();
          $('#button_memo_remove_modal_post').bind('click', function(e) {
            AIRBRAIN.Instaword.document.remove(item._id);
          });
          this_object.showMemoRemove();
        });
      var button_edit = $('<div/>')
        .attr('class', 'button card_memo_edit_button')
        .bind('click', function(e) {
          this_object.modal_state = 'edit';
          $('#memo_post_modal_id').val(item._id);
          $('#memo_post_modal_title').val(item.title);
          $('#memo_post_modal_body').val($('<div/>').html(item.body.replace(/<br \/>/g, '\n')).text());
          $('#button_memo_post_modal_post').unbind();
          $('#button_memo_post_modal_post').bind('click', function(e) {
            AIRBRAIN.Instaword.document.edit();
          });
          this_object.hideShade();
          this_object.showMemoPost();
        });
      button_container.append(button_remove);
      button_container.append(button_edit);
    }

    /* favorite */
    var button_favorite = $('<div/>')
      .attr('class', 'button card_memo_favorite_button')
      .bind('click', function() {
        this_object.modal_state = 'favorite';
        button_favorite.css('display', 'none');
        button_unfavorite.css('display', 'block');
        AIRBRAIN.Instaword.favorite.set(item._id);
      });
    var button_unfavorite = $('<div/>')
      .attr('class', 'button card_memo_unfavorite_button')
      .bind('click', function() {
        this_object.modal_state = 'unfavorite';
        button_unfavorite.css('display', 'none');
        button_favorite.css('display', 'block');
        AIRBRAIN.Instaword.favorite.remove(item._id);
      });
    button_container.append(button_favorite);
    button_container.append(button_unfavorite);
    if(item.is_favorite) {
      button_favorite.css('display', 'none');
    }
    else
    {
      button_unfavorite.css('display', 'none');
    }

    /* keyword */
    var keyword_container = $('<div/>').attr('class', 'card_memo_keyword_container');
    var keyword_list = [];
    var keyword_count = 0;
    while(keyword_list.length < 6 && keyword_count < item.keyword.length) {
      if(item.keyword[keyword_count].type == 'body' || item.keyword[keyword_count].type == 'number') {
        keyword_list.push(item.keyword[keyword_count]);
      }
      keyword_count++;
    }
    var keyword_text = '';
    for(var i = 0; i < keyword_list.length; i++) {
      if(i > 0) {
        keyword_text += ', ';
      }
      keyword_text += keyword_list[i].word;
    }
    var keyword = $('<p/>').html(keyword_text);
    keyword_container.append(keyword);

    var title_container = $('<div/>').attr('class', 'card_memo_title_container');
    var title = $('<div/>').html('<h3>' + title_text + '</h3>');
    var link = $('<span/>').attr('class', 'button glyphicon glyphicon-chevron-right');
    var link_container = $('<div/>').append(link);
    title_container
      .append(title)
      .append(link_container);


    /* content */
    var class_name = 'button dynamic_content card_memo_container';
    if(item.is_owner) {
      class_name += ' card_memo_owner';
    }
    if(item.is_read) {
      class_name += ' card_memo_is_read';
    }

    var content = $('<div/>')
      .attr('class', class_name)
      .attr('id', item._id)
      .append(button_container)
      .append(keyword_container)
      .append(title_container)
      .bind('click', function() {
        if(this_object.modal_state != 'none') {
          this_object.modal_state = 'none';
          return;
        }
        content.attr('class', class_name + ' card_memo_is_read');

        if(navigator.userAgent.indexOf('iPhone') != -1 || navigator.userAgent.indexOf('Android') != -1) {
          window.open(BASE_URL + 'views/document/' + item._id);
          return;
        }

        if(g_group_id != '') {
          AIRBRAIN.Instaword.comment.get(item._id);
        }
        AIRBRAIN.Instaword.document.setRead(item._id);
        this_object.setDetail(item);
        this_object.showMemoDetail();
      })
      .hover(
        function() {
          title_container.attr('class', 'card_memo_title_container card_memo_title_hover');
        },
        function() {
          title_container.attr('class', 'card_memo_title_container');
        }
      );

    container.append(content);
  }

  View.prototype.setGroupList = function(list) {
    var this_object = this;

    var container = $('#group_select_modal_group_list');
    container.empty();

    $('#group_control_button_container').empty();

    var count = 0;
    var limit = list.length;

    async.whilst(
      function() { return count < limit; },
      function(callback) {
        var item = list[count];

        var content = $('<li/>')
          .attr('class', 'button')
          .html(item.group_name + ' (' + item.count + ')')
          .bind('click', function() {
            g_group_id = item._id;
            $('#group_name').text(item.group_name);
            $('#group_member_count').text(item.count);
            $('#group_select_modal_group_name').text(item.group_name);
            this_object.initialize();
            this_object.showGroupHeader();
            AIRBRAIN.Instaword.document.initialize();
            AIRBRAIN.Instaword.document.random();
          });

        container.append(content);

        count++;

        callback(null);
      },
      function(error) {
      }
    );
  }

  return View;
})();



/* set */
AIRBRAIN.Instaword.view = new AIRBRAIN.Instaword.View();
