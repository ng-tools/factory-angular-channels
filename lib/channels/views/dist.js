'use strict';

//
// Required modules

var path = require('path');
var lazypipe = require('lazypipe');

//
// Gulp modules

var gulpif = require('gulp-if');
var jade = require('gulp-jade');
var ngtemplate = require('gulp-ngtemplate');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var htmlmin = require('gulp-htmlmin');
var nginclude = require('gulp-nginclude');
var concat = require('gulp-concat-util');
var rename = require('gulp-rename');

module.exports = function(gulp, config) {

  var src = config.src;
  return lazypipe()
    .pipe(function() {
      return gulpif('**/*.jade', jade({pretty: true}));
    })
    .pipe(htmlmin, {removeComments: true, collapseWhitespace: true})
    .pipe(ngtemplate, {module: config.ngModule || config.module || 'ngTemplate'})
    .pipe(ngAnnotate)
    .pipe(concat.scripts, 'views.tpl.js', {cwd: path.join(src.cwd, 'scripts'), base: src.cwd})
    .pipe(concat.header, config.banner)
    .pipe(gulp.dest, src.dest)
    .pipe(uglify)
    .pipe(rename, function(path) { path.extname = '.min.js'; })
    .pipe(concat.header, config.banner)
    .pipe(gulp.dest, src.dest);

};
