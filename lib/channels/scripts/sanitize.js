'use strict';

//
// Required modules

var path = require('path');
var combine = require('stream-combiner');
var eol = require('os').EOL;

//
// Gulp modules

var concat = require('gulp-concat-util');

module.exports = function(src, options) {

  return function ChannelFactory() {
    return combine(
      concat.header(['(function(window, document, undefined) {', eol, '\'use strict\';', eol].join('')),
      concat.footer([eol, eol, '})(window, document);', eol].join(''))
    );
  };

};


