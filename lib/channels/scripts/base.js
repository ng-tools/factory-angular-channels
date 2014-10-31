'use strict';

//
// Required modules

var combine = require('stream-combiner');

//
// Gulp modules

var transformify = require('gulp-transformify');
var gulpif = require('gulp-if');
var to5 = require('gulp-6to5');

module.exports = function(gulp, config) {

  var src = config.src;
  return function() {
    return combine(
      gulpif('**/*.es6.js', to5())
    );
  };

};
