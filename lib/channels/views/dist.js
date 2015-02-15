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

  return function ChannelFactory(src) {
    src = src || config.src;
    return combine(
      gulpif('**/*.jade', jade({pretty: true})),
      htmlmin({removeComments: true, collapseWhitespace: true}),
      ngtemplate({module: config.module}),
      ngAnnotate(),
      gulpif(/^app/.test(config.type), concat.scripts('views.tpl.js', {cwd: path.join(src.cwd, 'scripts'), base: src.cwd})),
      gulpif(/^com/.test(config.type), concat.scripts(config.pkg.name + '.tpl.js', {cwd: src.cwd})),
      gulpif(/^lib/.test(config.type), combine(
        concat.scripts(config.pkg.name + '.tpl.js', {cwd: src.cwd, base: src.cwd, passthrough: true}),
        rename(function(path) { if(path.dirname !== '.') path.dirname = 'modules'; })
      )),
      uglify({output: {beautify: true, indent_level: 2/*, quote_style: 1*/}, mangle: false, compress: false}),
      concat.header(config.banner),
      gulp.dest(src.dest),
      uglify(),
      rename(function(path) { path.extname = '.min.js'; }),
      concat.header(config.banner),
      gulp.dest(src.dest)
    );
  };

};
