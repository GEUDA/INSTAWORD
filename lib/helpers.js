// ViewHelper
exports.helpers = {
  // make link from url and title
  link_to: function(name, url) {
    return '<a href="' + url + '">' + name + '</a>';
  },
  // space to &nbsp; newline to <br />
  text_format: function(text) {
    return text.replace(/ /g, '&nbsp;').replace(/\r\n|\n|\r/g, '</p><p>');
  }
};

