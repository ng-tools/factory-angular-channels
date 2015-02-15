'use strict';

//
// Required modules

var combine = require('stream-combiner');
var changed = require('gulp-changed');
var sourcemaps = require('gulp-sourcemaps');

module.exports = function(gulp, config) {

  return function ChannelFactory(src) {
    src = src || config.src;
    return combine(
      // changed(src.tmp), // breaks index gulp-inject
      sourcemaps.init(),
      require('./base')(gulp, config)(),
      sourcemaps.write('', {includeContent: false, sourceRoot: '..'}),
      // sourcemaps.write(),
      gulp.dest(src.tmp)
    );
  };

};


