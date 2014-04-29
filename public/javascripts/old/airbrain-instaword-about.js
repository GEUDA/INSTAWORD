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
AIRBRAIN.Instaword.Slide = (function() {

  /**
   * constructor
   */
  function Slide() {
    this.document_list = [];
    this.offset = 0;
    this.range = 50;
    this.next_index = 0;
  }

  /**
   * initialize
   */
  Slide.prototype.initialize = function() {
    this.document_list = [];
    this.offset = 0;

    this.random();
  }

  /**
   * random
   */
  Slide.prototype.random = function() {
    var this_object = this;
    var data = {
      range: this.range
    };

    $.ajax({
      type: 'POST',
      url: './documents/random',
      data: data,
      success: function(result) {
        result = JSON.parse(result);
        this_object.document_list = result;
        this_object.next();
      }
    });
  }

  /**
   * put
   */
  Slide.prototype.next = function() {
    var this_object = this;
    var container = $('#slide_container');

    var item = this.document_list[this.next_index];

    item.body = item.body.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    item.body = item.body.replace(/\n/g, '<br />');

    if(item.body.length > 400) {
      item.body = item.body.substring(0, 400) + '...'
    }

    var dd = new Date(item.updated_at);
    var time = dd.getFullYear()
      + '-' + (dd.getMonth() + 1)
      + '-' + dd.getDate();

    var title = $('<h2/>').html(item.title);
    var body = $('<p/>').html(item.body);
    var content = $('<div/>')
      .attr('class', 'slide_content')
      .attr('id', item._id)
      .append(title)
      .append(body);

    container.append(content).fadeIn(1500, function() {
      setTimeout(function() {
        container.fadeOut(1500, function() {
          $('.slide_content').remove();
          this_object.next();
        });
      }, 1000);
    });

    this.next_index++;
    if(this.next_index >= this.document_list.length) {
      this.next_index = 0;
    }
  }

  return Slide;
})();



/* set */
AIRBRAIN.Instaword.slide = new AIRBRAIN.Instaword.Slide();
AIRBRAIN.Instaword.slide.initialize();
