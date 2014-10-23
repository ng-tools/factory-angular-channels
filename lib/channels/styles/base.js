'use strict';

//
// Required modules

var combine = require('stream-combiner');

//
// Gulp modules

var autoprefixer = require('gulp-autoprefixer');
var gulpif = require('gulp-if');
var less = require('gulp-less');
var sass = require('gulp-sass');


module.exports = function(gulp, config) {

  var src = config.src;
  return function() {
    return combine(
      gulpif('**/*.less', less()),
      gulpif('**/*.{sass,scss}', sass()),
      autoprefixer('last 1 version')
    );
  };

};
