'use strict';

//
// Required modules

var path = require('path');
var combine = require('stream-combiner');

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
  return function ChannelFactory() {
    return combine(
      gulpif('**/*.jade', jade({pretty: true})),
      htmlmin({removeComments: true, collapseWhitespace: true}),
      ngtemplate({module: config.ngModule || config.module || config.pkg.module || 'ngTemplate'}),
      ngAnnotate(),
      concat.scripts('views.tpl.js', {cwd: path.join(src.cwd, 'scripts'), base: src.cwd}),
      gulp.dest(src.dest),
      uglify(),
      rename(function(path) { path.extname = '.min.js'; }),
      concat.header(config.banner),
      gulp.dest(src.dest)
    );
  };

};
