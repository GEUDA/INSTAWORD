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
    this.range = 50;
  }

  /**
   * initialize
   */
  Document.prototype.initialize = function() {
    this.document_list = [];
    this.offset = 0;
    $('.dynamic_content').remove();
  }

  /**
   * post
   */
  Document.prototype.post = function() {
    var this_object = this;
    var data = {
      group_id: $('#input_group_id').val(),
      title: $('#input_title').val(),
      body: $('#input_body').val()
    };

    $.ajax({
      type: 'POST',
      url: './groups/documents/post',
      data: data,
      success: function(result) {
        console.log(result);
        $('#input_title').val('');
        $('#input_body').val('');
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
   * edit
   */
  Document.prototype.edit = function() {
    var this_object = this;
    var data = {
      _id: $('#input_edit_id').val(),
      title: $('#input_edit_title').val(),
      body: $('#input_edit_body').val()
    };

    $.ajax({
      type: 'POST',
      url: './groups/documents/edit',
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
  Document.prototype.remove = function(target_id) {
    var this_object = this;
    var data = {
      _id: target_id
    };

    $.ajax({
      type: 'POST',
      url: './groups/documents/remove',
      data: data,
      success: function(result) {
        console.log(result);
        this_object.initialize();
        this_object.list();
        $('#confirm_modal').modal('hide');
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        document.location = BASE_URL;
      }
    });
  }

  /**
   * random
   */
  Document.prototype.random = function() {
    var this_object = this;
    var data = {
      group_id: $('#input_group_id').val(),
      range: this.range
    };

    $.ajax({
      type: 'POST',
      url: './groups/documents/random',
      data: data,
      success: function(result) {
        result = JSON.parse(result);
        this_object.document_list = result;
        this_object.put();
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        document.location = BASE_URL;
      }
    });
  }

  /**
   * put
   */
  Document.prototype.put = function() {
    var this_object = this;
    var container = $('#wrap');

    container.masonry({
      columnWidth: 10,
      itemSelector: '.masonry',
      hiddenStyle: { opacity: 0, transform: 'scale(1)' },
      visibleStyle: { opacity: 1, transform: 'scale(1)' }
    });

    var count = 0;
    var limit = this.document_list.length;

    async.whilst(
      function() { return count < limit; },
      function(callback) {
        var item = this_object.document_list[count];

        var title_text = item.title;
        if(item.title.length > 40) {
          title_text = title_text.substring(0, 40) + '...'
        }

        var body_text = item.body;
        if(item.body.length > 56) {
          body_text = body_text.substring(0, 56) + '...'
        }

        item.body = item.body.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        item.body = item.body.replace(/\n/g, '<br />');

        var dd = new Date(item.updated_at);
        var time = dd.getFullYear()
          + '-' + (dd.getMonth() + 1)
          + '-' + dd.getDate();

        var button_favorite = $('<button/>')
          .attr('class', 'btn btn-info to_edit')
          .text('Favorite')
          .bind('click', function(e) {
            AIRBRAIN.Instaword.favorite.set(item._id);
          });
        var button_unfavorite = $('<button/>')
          .attr('class', 'btn btn-warning to_edit')
          .text('Unfavorite')
          .bind('click', function(e) {
            AIRBRAIN.Instaword.favorite.remove(item._id);
          });

        var class_text = 'content_box masonry dynamic_content';
        if(item.is_owner) {
          class_text += ' is_owner';
        }

        var title = $('<div/>').html('<span>' + title_text + '</span>');
        var body = $('<div/>').html('<span>' + body_text + '</span>');
        var content = $('<div/>')
          .attr('class', class_text)
          .attr('id', item._id)
          .append(body)
          .append(title)
          .css('opacity', '0')
          .bind('click', function(e) {
            $('.to_edit').remove();
            if(item.is_favorite) {
              $('#button_show_close').after(button_unfavorite);
            }
            else
            {
              $('#button_show_close').after(button_favorite);
            }
            $('#show_title').html(item.title);
            $('#show_body').html(item.body);
            $('#show_time').html(time);
            $('#show_modal').modal('show');
          });
        container.append(content).masonry('appended', content);
        count++;

        callback(null);
      },
      function(error) {
        $('.content_box').animate( { opacity: '1.0' }, { duration: 100, easing: 'swing'} );

        var end = $('<div/>').attr('class', 'content_foot masonry dynamic_content');
        container.append(end).masonry('appended', end);
      }
    );

  }

  /**
   * list
   */
  Document.prototype.list = function() {
    var this_object = this;
    var data = {
      group_id: $('#input_group_id').val(),
      offset: this.offset,
      range: this.range
    };

    $.ajax({
      type: 'POST',
      url: './groups/documents/list',
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
  Document.prototype.table = function(list) {
    var this_object = this;
    var container = $('<table/>').attr('class', 'content_table table masonry dynamic_content')
      .html('<tr><th>TITLE</th><th>BODY</th><th>UPDATED</th><th>CREATED</th><th>FAVORITE</th></tr>');

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
      var favorite = $('<td/>').html('');
      if(item.count > 0) {
        favorite.html(item.count);
      }

      var button_favorite = $('<button/>')
        .attr('class', 'btn btn-info to_edit')
        .text('Favorite')
        .bind('click', function(e) {
          AIRBRAIN.Instaword.favorite.set(item._id);
        });
      var button_unfavorite = $('<button/>')
        .attr('class', 'btn btn-warning to_edit')
        .text('Unfavorite')
        .bind('click', function(e) {
          AIRBRAIN.Instaword.favorite.remove(item._id);
        });
      var button_edit = $('<button/>')
        .attr('class', 'btn btn-success to_edit')
        .text('Edit')
        .bind('click', function(e) {
          $('#input_edit_id').val(item._id);
          $('#input_edit_title').val(item.title);
          $('#input_edit_body').val($('<div/>').html(item.body.replace(/<br \/>/g, '\n')).text());
          $('#show_modal').modal('hide');
          $('#edit_modal').modal('show');
        });
      var button_remove = $('<button/>')
        .attr('class', 'btn btn-danger to_edit')
        .text('Remove')
        .bind('click', function(e) {
          $('#confirm_text').text('Are you sure you want to remove?');
          $('#button_confirm').bind('click', function(e) {
            this_object.remove(item._id);
          });
          $('#show_modal').modal('hide');
          $('#confirm_modal').modal('show');
        });

      var content = $('<tr/>').attr('id', item._id)
        .append(title)
        .append(body)
        .append(updated)
        .append(created)
        .append(favorite)
        .bind('click', function(e) {
          $('.to_edit').remove();
          $('#button_show_close').after(button_remove);
          $('#button_show_close').after(button_edit);
          if(item.is_favorite) {
            $('#button_show_close').after(button_unfavorite);
          }
          else
          {
            $('#button_show_close').after(button_favorite);
          }
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

  return Document;
})();



/* set */
AIRBRAIN.Instaword.document = new AIRBRAIN.Instaword.Document();
