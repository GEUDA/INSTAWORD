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
    this.range = 50;
  }

  /**
   * initialize
   */
  Favorite.prototype.initialize = function() {
    this.document_list = [];
    this.offset = 0;
    $('.dynamic_content').remove();
  }

  /**
   * set
   */
  Favorite.prototype.set = function(target_id) {
    var this_object = this;
    var data = {
      group_id: $('#input_group_id').val(),
      _id: target_id
    };

    $.ajax({
      type: 'POST',
      url: './groups/favorites/set',
      data: data,
      success: function(result) {
        console.log(result);
        this_object.initialize();
        this_object.list();
        $('#show_modal').modal('hide');
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        document.location = BASE_URL;
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

    $.ajax({
      type: 'POST',
      url: './groups/favorites/remove',
      data: data,
      success: function(result) {
        console.log(result);
        this_object.initialize();
        this_object.list();
        $('#show_modal').modal('hide');
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        document.location = BASE_URL;
      }
    });
  }

  /**
   * list
   */
  Favorite.prototype.list = function() {
    var this_object = this;
    var data = {
      group_id: $('#input_group_id').val(),
      offset: this.offset,
      range: this.range
    };

    $.ajax({
      type: 'POST',
      url: './groups/favorites/list',
      data: data,
      success: function(result) {
        $('.next').remove();
        result = JSON.parse(result);
        if(result.length > 0) {
          this_object.document_list = this_object.document_list.concat(result);
          this_object.offset += result.length;
          this_object.table(result);
        }
        else
        {
          var end = $('<div/>').attr('class', 'content_foot masonry dynamic_content');
          var container = $('#wrap').masonry({
            columnWidth: 10,
            itemSelector: '.masonry',
            hiddenStyle: { opacity: 0, transform: 'scale(1)' },
            visibleStyle: { opacity: 1, transform: 'scale(1)' }
          });
          container.append(end).masonry('appended', end);
        }
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        document.location = BASE_URL;
      }
    });
  }

  /**
   * table
   */
  Favorite.prototype.table = function(list) {
    var this_object = this;
    var container = $('<table/>').attr('class', 'content_table table masonry dynamic_content')
      .html('<tr><th>TITLE</th><th>BODY</th><th>UPDATED</th><th>CREATED</th><th>OWNER</th></tr>');

    $('#wrap').masonry({
      columnWidth: 10,
      itemSelector: '.masonry',
      hiddenStyle: { opacity: 0, transform: 'scale(1)' },
      visibleStyle: { opacity: 1, transform: 'scale(1)' }
    });

    _.each(list, function(item) {
      var title_text = item.title;
      if(item.title.length > 40) {
        title_text = title_text.substring(0, 40) + '...'
      }

      var body_text = item.body;
      if(item.body.length > 60) {
        body_text = body_text.substring(0, 60) + '...'
      }

      item.body = item.body.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
      item.body = item.body.replace(/\n/g, '<br />');

      var dd;
      dd  = new Date(item.updated_at);
      var u_time = dd.getFullYear()
        + '-' + (dd.getMonth() + 1)
        + '-' + dd.getDate();
      dd = new Date(item.created_at);
      var c_time = dd.getFullYear()
        + '-' + (dd.getMonth() + 1)
        + '-' + dd.getDate();

      var title = $('<td/>').html(title_text);
      var body = $('<td/>').html(body_text);
      var updated = $('<td/>').html(u_time);
      var created = $('<td/>').html(c_time);
      var owner = $('<td/>').html('');
      if(item.is_owner) {
        owner.html('*');
      }

      var button_remove = $('<button/>')
        .attr('class', 'btn btn-warning to_edit')
        .text('Unfavorite')
        .bind('click', function(e) {
          this_object.remove(item._id);
        });

      var content = $('<tr/>').attr('id', item._id)
        .append(title)
        .append(body)
        .append(updated)
        .append(created)
        .append(owner)
        .bind('click', function(e) {
          $('.to_edit').remove();
          $('#button_show_close').after(button_remove);
          $('#show_title').html(item.title);
          $('#show_body').html(item.body);
          $('#show_time').html(u_time);
          $('#show_modal').modal('show');
        });

      container.append(content);
    });

    $('#wrap').append(container).masonry('appended', container);

    var content_foot;
    if(list.length == this.range) {
      content_foot = $('<div/>').attr('class', 'next content_foot masonry dynamic_content')
        .text('more...')
        .hover(function(e) {
          this_object.list();
        });
    }
    else
    {
      content_foot = $('<div/>').attr('class', 'content_foot masonry dynamic_content');
    }

    $('#wrap').append(content_foot).masonry('appended', content_foot);
  }

  return Favorite;
})();



/* set */
AIRBRAIN.Instaword.favorite = new AIRBRAIN.Instaword.Favorite();
