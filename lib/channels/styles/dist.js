'use strict';

//
// Required modules

var path = require('path');
var combine = require('stream-combiner');

//
// Gulp modules

var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var cleancss = require('gulp-cleancss');
var concat = require('gulp-concat-util');
var gulpif = require('gulp-if');
var less = require('gulp-less');
var rename = require('gulp-rename');

module.exports = function(gulp, config) {

  var src = config.src;
  return function() {
    return combine(
      sourcemaps.init(),
      gulpif('**/*.less', less()),
      autoprefixer('last 1 version'),
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


