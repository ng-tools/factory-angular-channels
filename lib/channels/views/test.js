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
var ngAnnotate = require('gulp-ng-annotate');
var htmlmin = require('gulp-htmlmin');
var concat = require('gulp-concat-util');

module.exports = function(gulp, config) {

  var src = config.src;
  var test = config.test;
  return function ChannelFactory() {
    return combine(
      gulpif('**/*.jade', jade({pretty: true})),
      htmlmin({removeComments: true, collapseWhitespace: true}),
      ngtemplate({module: config.module}),
      ngAnnotate(),
      gulpif(/^app/.test(config.type), concat.scripts('views.tpl.js', {cwd: path.join(src.cwd, 'scripts'), base: src.cwd})),
      gulpif(/^com/.test(config.type), concat.scripts(config.pkg.name + '.tpl.js', {cwd: src.cwd})),
      gulp.dest(test.tmp)
    );
  };

};
