'use strict';

//
// Required modules

var combine = require('stream-combiner');

//
// Gulp modules

var transformify = require('gulp-transformify');
var gulpif = require('gulp-if');
// var Promise = require('bluebird');
// var less = transformify(Promise.promisify(require('less').render), {name: 'gulp-less', ext: '.css', config: function(file) { this.filename = file.path; }});
var less = require('gulp-less');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var rename = require('gulp-rename');

module.exports = function(gulp, config) {

  var src = config.src;
  return function() {
    return combine(
      gulpif('**/*.less', less()),
      gulpif('**/*.{sass,scss}', sass()),
      rename(function(path) { path.extname = '.css'; }),
      autoprefixer('last 1 version')
    );
  };

};
