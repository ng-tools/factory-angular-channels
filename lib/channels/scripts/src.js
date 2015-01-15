'use strict';

//
// Required modules

var combine = require('stream-combiner');
var sourcemaps = require('gulp-sourcemaps');

module.exports = function(gulp, config) {

  return function ChannelFactory(src) {
    src = src || config.src;
    return combine(
      sourcemaps.init(),
      require('./base')(gulp, config)(),
      // sourcemaps.write('.', {sourceRoot: src.tmp}),
      sourcemaps.write(),
      gulp.dest(src.tmp)
    );
  };

};


