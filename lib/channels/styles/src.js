'use strict';

//
// Required modules

var path = require('path');
var combine = require('stream-combiner');

//
// Gulp modules

var gulpif = require('gulp-if');
var less = require('gulp-less');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');

module.exports = function(gulp, config) {

  var src = config.src;
  return function ChannelFactory() {
    return combine(
      less(),
      gulpif('**/*.less', less()),
      gulpif('**/*.{sass,scss}', sass()),
      autoprefixer('last 1 version'),
      gulp.dest(src.tmp)
    );
  };

};


