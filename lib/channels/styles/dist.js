'use strict';

//
// Required modules

var path = require('path');
var combine = require('stream-combiner');

//
// Gulp modules

var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat-util');
var cleancss = require('gulp-cleancss');
var concat = require('gulp-concat-util');
var gulpif = require('gulp-if');
var rename = require('gulp-rename');


module.exports = function(gulp, config) {
  config.concatStyles = undefined;
  var src = config.src;
  return function ChannelFactory() {
    return combine(
      sourcemaps.init(),
      require('./base')(gulp, config)(),
      //gulpif(false, concat(src.cwd + '.css', {cwd: path.join(src.cwd, 'styles')})),
      concat(src.cwd + '.css', {cwd: src.cwd}),
      concat.header(config.banner),
      // sourcemaps.write('.'),
      gulp.dest(src.dest),
      cleancss(),
      rename(function(path) { path.extname = '.min.css'; }),
      concat.header(config.banner),
      // sourcemaps.write('.'),
      gulp.dest(src.dest)
    );
  };
};


