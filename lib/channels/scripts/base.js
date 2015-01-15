'use strict';

//
// Required modules

var combine = require('stream-combiner');

//
// Gulp modules

var transformify = require('gulp-transformify');
var gulpif = require('gulp-if');
var to5 = require('gulp-6to5');
var rename = require('gulp-rename');

module.exports = function(gulp, config) {

  var src = config.src;
  return function() {
    return combine(
      gulpif('**/*.{es6.js,es6,es}', to5()),
      gulpif('**/*.{es6.js,es6,es}', rename(function(path) { path.extname = '.js'; }))
    );
  };

};
