// DinamicHelper
exports.dynamicHelpers = {
  // user_id
  user_id:  function(req, res) {
    return req.session.user_id;
  },
  // message
  message: function(req, res) {
    return function(type) {
      var messages = req.flash(type);
      if(!messages) {
        return '';
      }
      var buf = '<ul class="message_' + type + '">';
      messages.forEach(function(msg) {
        var li = '<li>' + msg + '</li>';
        buf += li;
      });
      buf += '</ul>';
      return buf;
    };
  }
};
