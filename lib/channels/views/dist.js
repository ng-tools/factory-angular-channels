'use strict';

//
// Required modules

var path = require('path');
var combine = require('stream-combiner2');
var gulpif = require('gulp-if');
var vfs = require('vinyl-fs');
var jade = require('gulp-jade');
var ngtemplate = require('gulp-ngtemplate');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var htmlmin = require('gulp-htmlmin');
var concat = require('gulp-concat-util');
var rename = require('gulp-rename');

module.exports = function ChannelFactory(src, options) {
  var config = this, paths = this.paths, pkg = this.pkg;

  return combine.obj(
    require('./base').bind(this)(),
    htmlmin({removeComments: true, collapseWhitespace: true}),
    ngtemplate({module: config.module}),
    ngAnnotate(),
    gulpif(/^app/.test(config.type), concat.scripts('views.tpl.js', {cwd: path.join(paths.cwd, 'scripts'), base: paths.cwd})),
    gulpif(/^com/.test(config.type), concat.scripts(pkg.name + '.tpl.js', {cwd: paths.cwd})),
    gulpif(/^lib/.test(config.type), combine(
      concat.scripts((config.name || pkg.name) + '.tpl.js', {cwd: paths.cwd, base: paths.cwd, passthrough: config.passthrough}),
      rename(function(path) { if(path.dirname !== '.') path.dirname = 'modules'; })
    )),
    uglify({output: {beautify: true, indent_level: 2/*, quote_style: 1*/}, mangle: false, compress: false}),
    concat.header(config.banner),
    vfs.dest(paths.dest),
    uglify(),
    rename(function(path) { path.extname = '.min.js'; }),
    concat.header(config.banner),
    vfs.dest(paths.dest)
  );
};

