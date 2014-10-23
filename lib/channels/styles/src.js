'use strict';

//
// Required modules

var path = require('path');
var lazypipe = require('lazypipe');

//
// Gulp modules

var autoprefixer = require('gulp-autoprefixer');
var changed = require('gulp-changed');
var gulpif = require('gulp-if');
var less = require('gulp-less');
var plumber = require('gulp-plumber');
var gulpFilter = require('gulp-filter');
var lessFilter = gulpFilter('**/*.less');

module.exports = function(gulp, config) {

  var src = config.src;
  return function() {
    return require('stream-combiner')(
      less(),
      gulpif('**/*.less', less()),
      autoprefixer('last 1 version'),
      gulp.dest(src.tmp)
    );
  };

  // return lazypipe()
  //   .pipe(changed, src.tmp)
  //   // .pipe(plumber)
  //   // .pipe(function() {
  //   //   return gulpif('**/*.less', less());
  //   // })
  //   .pipe(autoprefixer, 'last 1 version')
  //   // .pipe(plumber.stop)
  //   // .pipe(concat, function(path) {
  //   //   var dir = path.dirname.split(path.sep).pop();
  //   //   path.basename = dir !== src.cwd ? dir : pkg.name;
  //   //   path.extname = '.css';
  //   // })
  //   .pipe(gulp.dest, src.tmp);

};


