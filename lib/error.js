// ErrorHandler
exports.errorHandler = function(err, req, res) {
  res.render('err', {
    status: 500,
    title: '500 Internal Server Error',
    err: err
  });
};

