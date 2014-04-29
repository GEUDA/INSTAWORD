/*
 * Text Preprocessing
 */

/* 英数字記号を半角に */
exports.toHankaku = function(text) {
  return text.replace(/[！-～]/g, function(s) {
    return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
  });
};

/* 英数字記号を全角に */
exports.toZenkaku = function(text) {
  return text.replace(/[!-~]/g, function(s) {
    return String.fromCharCode(s.charCodeAt(0) + 0xFEE0);
  });
};

/* 英数字を半角に */
exports.toHankakuAlphanumeric = function(text) {
  return text.replace(/[０-９Ａ-Ｚａ-ｚ]/g, function(s) {
    return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
  });
};

/* 英数字を全角に */
exports.toZenkakuAlphanumeric = function(text) {
  return text.replace(/[0-9A-Za-z]/g, function(s) {
    return String.fromCharCode(s.charCodeAt(0) + 0xFEE0);
  });
};

/* 改行記号の統一 */
exports.unifyNewline = function(text) {
  return text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
};



/* encode */
exports.encode = function(text) {
  text = exports.unifyNewline(text);
  text = exports.toZenkaku(text);
  text = exports.toHankakuAlphanumeric(text);
  return text;
};

/* decode */
exports.decode = function(text) {
  return exports.toHankaku(text);
};

/* detectLanguage */
exports.detectLanguage = function(text) {
  var language = 'unknown';

  if(text.match(/^[！＂＃＄％＆＇（）＊＋，－．／：；＜＝＞？＠［＼］＾＿｀｛｜｝～–~—＿“’［］£A-Za-z0-9\s]+$/)) {
    language = 'English';
  }

  return language;
};
