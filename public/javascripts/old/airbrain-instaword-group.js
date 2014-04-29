/**
 * @fileoverview
 * AIRBRAIN-Instaword-Main
 */

/** namespace */
var AIRBRAIN;
if (!AIRBRAIN) AIRBRAIN = {};
if (!AIRBRAIN.Instaword) AIRBRAIN.Instaword = {};
if (!AIRBRAIN.Instaword.group) AIRBRAIN.Instaword.group = {};



/**
 * DOCUMENT
 */
AIRBRAIN.Instaword.Group = (function() {

  /**
   * constructor
   */
  function Group() {
    this.group_list = [];
  }

  /**
   * initialize
   */
  Group.prototype.initialize = function() {
    this.group_list = [];
    $('.dynamic_content').remove();
  }

  /**
   * create
   */
  Group.prototype.create = function() {
    var this_object = this;
    var data = {
      group_name: $('#input_group_name').val()
    };

    $.ajax({
      type: 'POST',
      url: './groups/create',
      data: data,
      success: function(result) {
        $('#input_group_name').val('');
        this_object.initialize();
        AIRBRAIN.Instaword.session.config();
        $('#group_create_modal').modal('hide');
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        document.location = BASE_URL;
      }
    });
  }

  /**
   * invite
   */
  Group.prototype.invite = function() {
    var this_object = this;
    var data = {
      group_id: $('#input_group_id').val(),
      email_address: $('#input_group_email_address').val(),
      message: $('#input_group_message').val()
    };

    $.ajax({
      type: 'POST',
      url: './groups/invite',
      data: data,
      success: function(result) {
        $('#input_group_email_address').val('');
        $('#input_group_message').val('');
        $('#group_invite_modal').modal('hide');
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        document.location = BASE_URL;
      }
    });
  }

  /**
   * remove
   */
  Group.prototype.remove = function() {
    var this_object = this;
    var data = {
      group_id: $('#input_group_id').val()
    };

    $.ajax({
      type: 'POST',
      url: './groups/remove',
      data: data,
      success: function(result) {
        document.location = BASE_URL;
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        document.location = BASE_URL;
      }
    });
  }

  /**
   * delete
   */
  Group.prototype.delete = function() {
    var this_object = this;
    var data = {
      group_id: $('#input_group_id').val()
    };

    $.ajax({
      type: 'POST',
      url: './groups/delete',
      data: data,
      success: function(result) {
        document.location = BASE_URL;
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        document.location = BASE_URL;
      }
    });
  }

  /**
   * get
   */
  Group.prototype.get = function() {
    var this_object = this;
    var data = {
      group_id: $('#input_group_id').val()
    };

    $.ajax({
      type: 'POST',
      url: './groups/get',
      data: data,
      success: function(result) {
        result = JSON.parse(result);
        this_object.put(result);
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        document.location = BASE_URL;
      }
    });
  }

  /**
   * put
   */
  Group.prototype.put = function(item) {
    var this_object = this;
    var container = $('<table/>').attr('class', '')
      .html('<tr><th>NAME</th><th>MEMBER</th><th>UPDATED</th><th>CREATED</th></tr>');

    var dd;
    dd  = new Date(item.updated_at);
    var u_time = dd.getFullYear()
      + '-' + (dd.getMonth() + 1)
      + '-' + dd.getDate();
    dd = new Date(item.created_at);
    var c_time = dd.getFullYear()
      + '-' + (dd.getMonth() + 1)
      + '-' + dd.getDate();

    var name = $('<td/>').html(item.group_name);
    var count = $('<td/>').html(item.count);
    var updated = $('<td/>').html(u_time);
    var created = $('<td/>').html(c_time);

    var content = $('<tr/>').attr('id', item._id)
      .append(name)
      .append(count)
      .append(updated)
      .append(created)
      ;

    container.append(content);

    $('#button_group_invite').before(container);

    // add button
    if(item.is_owner) {
      var button_delete = $('<button/>')
        .attr('class', 'btn btn-danger')
        .text('Delete')
        .bind('click', function(e) {
          $('#confirm_text').text('Are you sure you want to delete this group?');
          $('#button_confirm').bind('click', function(e) {
            this_object.delete();
          });
          $('#confirm_modal').modal('show');
        });

      $('#button_group_resign').after(button_delete);
    }
  }

  /**
   * list
   */
  Group.prototype.list = function() {
    var this_object = this;
    var data = {
    };

    $.ajax({
      type: 'POST',
      url: './groups/list',
      data: data,
      success: function(result) {
        result = JSON.parse(result);
        this_object.table(result);
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        document.location = BASE_URL;
      }
    });
  }

  /**
   * table
   */
  Group.prototype.table = function(list) {
    var this_object = this;
    var container = $('<table/>').attr('class', '')
      .html('<tr><th>NAME</th><th>MEMBER</th><th>UPDATED</th><th>CREATED</th></tr>');

    _.each(list, function(item) {
      var dd;
      dd  = new Date(item.updated_at);
      var u_time = dd.getFullYear()
        + '-' + (dd.getMonth() + 1)
        + '-' + dd.getDate();
      dd = new Date(item.created_at);
      var c_time = dd.getFullYear()
        + '-' + (dd.getMonth() + 1)
        + '-' + dd.getDate();

      var name = $('<td/>').html(item.group_name);
      var count = $('<td/>').html(item.count);
      var updated = $('<td/>').html(u_time);
      var created = $('<td/>').html(c_time);

      var content = $('<tr/>').attr('id', item._id)
        .append(name)
        .append(count)
        .append(updated)
        .append(created)
        .bind('click', function(e) {
          document.location = BASE_URL + 'groups/view/' + item._id;
        })
        ;

      container.append(content);
    });

    $('#button_group_create').before(container);
  }

  return Group;
})();



/* set */
AIRBRAIN.Instaword.group = new AIRBRAIN.Instaword.Group();
