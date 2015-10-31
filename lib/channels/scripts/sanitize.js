'use strict';

var combine = require('stream-combiner2');
var eol = require('os').EOL;
var concat = require('gulp-concat-util');

module.exports = function() {
  return combine.obj(
    concat.header(['(function(window, document, undefined) {', eol, '\'use strict\';', eol].join('')),
    concat.footer([eol, eol, '})(window, document);', eol].join(''))
  );
};
