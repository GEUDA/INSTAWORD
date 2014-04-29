var bcrypt = require('bcrypt');

exports.create = function(password) {
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(password, salt);
  return hash;
};

exports.compare = function(password, hash) {
  var isAuthorized = bcrypt.compareSync(password, hash);
  return isAuthorized;
}
