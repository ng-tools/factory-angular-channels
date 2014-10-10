'use strict';

//
// Required modules

var path = require('path');
var lazypipe = require('lazypipe');

//
// Gulp modules

var changed = require('gulp-changed');
var gulpif = require('gulp-if');
var jade = require('gulp-jade');
var plumber = require('gulp-plumber');

module.exports = function(gulp, config) {

  var src = config.src;
  return lazypipe()
    .pipe(changed, src.tmp)
    .pipe(plumber)
    .pipe(function() {
      return gulpif('**/*.jade', jade({pretty: true}));
    })
    .pipe(plumber.stop)
    .pipe(gulp.dest, src.tmp);

};


