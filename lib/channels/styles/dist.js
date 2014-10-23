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
var sass = require('gulp-sass');
var rename = require('gulp-rename');

module.exports = function(gulp, config) {

  var src = config.src;
  return function ChannelFactory() {
    return combine(
      sourcemaps.init(),
      gulpif('**/*.less', less()),
      gulpif('**/*.{sass,scss}', sass()),
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

  // .pipe(concat, function(path) {
  //   var dir = path.dirname.split(path.sep).pop();
  //   path.basename = dir !== src.cwd ? dir : pkg.name;
  //   path.extname = '.css';
  // })

};


