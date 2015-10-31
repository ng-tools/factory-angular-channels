'use strict';

var through = require('through2');

module.exports = function safe() {
  // Allow combine.obj to start with a "safe" pipe
  return through.obj(function(file, encoding, next) {
    next(null, file);
  });
};
