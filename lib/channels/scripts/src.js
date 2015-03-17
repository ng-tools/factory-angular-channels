'use strict';

//
// Required modules

var combine = require('stream-combiner');
var sourcemaps = require('gulp-sourcemaps');
var gulpif = require('gulp-if');

module.exports = function(gulp, config) {

  return function ChannelFactory(src) {
    src = src || config.src;
    return combine(
      gulpif(['dev', true].indexOf(config.sourcemaps) !== -1, sourcemaps.init()),
      require('./base')(gulp, config)(),
      gulpif(['dev', true].indexOf(config.sourcemaps) !== -1, sourcemaps.write('.', {includeContent: false, debug:true, sourceRoot: '/'})),
      gulp.dest(src.tmp)
    );
  };

};


