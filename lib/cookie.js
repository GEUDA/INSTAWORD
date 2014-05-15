// SetCookie
var setCookie = exports.setCookie = function(res, val) {
  res.cookie('authtoken', val, {
    path: '/',
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
  });
};
