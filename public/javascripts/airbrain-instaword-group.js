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
  }

  /**
   * create
   */
  Group.prototype.create = function() {
    var this_object = this;
    var data = {
      group_name: $('#group_create_modal_group_name').val()
    };

    $.ajax({
      type: 'POST',
      url: BASE_URL + 'groups/create',
      data: data,
      success: function(result) {
        $('#group_create_modal_group_name').val('');
        this_object.initialize();
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
      }
    });
  }

  /**
   * invite
   */
  Group.prototype.invite = function() {
    var this_object = this;
    var data = {
      group_id: g_group_id,
    };

    $.ajax({
      type: 'POST',
      url: BASE_URL + 'groups/invite',
      data: data,
      success: function(result) {
        AIRBRAIN.Instaword.view.showGroupInvite(JSON.parse(result));
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
      }
    });
  }

  /**
   * remove
   */
  Group.prototype.remove = function() {
    var this_object = this;
    var data = {
      group_id: g_group_id
    };

    $.ajax({
      type: 'POST',
      url: BASE_URL + 'groups/remove',
      data: data,
      success: function(result) {
        location.href = BASE_URL;
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
      }
    });
  }

  /**
   * delete
   */
  Group.prototype.delete = function() {
    var this_object = this;
    var data = {
      group_id: g_group_id
    };

    $.ajax({
      type: 'POST',
      url: BASE_URL + 'groups/delete',
      data: data,
      success: function(result) {
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
      }
    });
  }

  /**
   * get
   */
  Group.prototype.get = function() {
    var this_object = this;
    var data = {
      group_id: g_group_id
    };

    $.ajax({
      type: 'POST',
      url: BASE_URL + 'groups/get',
      data: data,
      success: function(result) {
        result = JSON.parse(result);
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
      }
    });
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
      url: BASE_URL + 'groups/list',
      data: data,
      success: function(result) {
        result = JSON.parse(result);
        AIRBRAIN.Instaword.view.setGroupList(result);
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
      }
    });
  }

  return Group;
})();



/* set */
AIRBRAIN.Instaword.group = new AIRBRAIN.Instaword.Group();
