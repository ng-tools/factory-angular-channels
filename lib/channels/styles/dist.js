'use strict';

//
// Required modules

var path = require('path');
var lazypipe = require('lazypipe');

//
// Gulp modules

var autoprefixer = require('gulp-autoprefixer');
var cleancss = require('gulp-cleancss');
var concat = require('gulp-concat-util');
var gulpif = require('gulp-if');
var less = require('gulp-less');
var rename = require('gulp-rename');

module.exports = function(gulp, config) {

  var src = config.src;
  return lazypipe()
    .pipe(function() {
      return gulpif('**/*.less', less());
    })
    .pipe(autoprefixer, 'last 1 version')
    .pipe(concat.header, config.banner)
    // .pipe(sourcemaps.write, '.')
    .pipe(gulp.dest, src.dest)
    .pipe(cleancss)
    .pipe(rename, function(path) { path.extname = '.min.css'; })
    .pipe(concat.header, config.banner)
    // .pipe(sourcemaps.write, '.')
    .pipe(gulp.dest, src.dest);

};


