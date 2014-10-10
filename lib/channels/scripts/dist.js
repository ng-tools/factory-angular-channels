'use strict';

//
// Required modules

var path = require('path');
var lazypipe = require('lazypipe');

//
// Gulp modules

var concat = require('gulp-concat-util');
var ngAnnotate = require('gulp-ng-annotate');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

module.exports = function(gulp, config) {

  var src = config.src;
  return lazypipe()
    // .pipe(sourcemaps.init)
    .pipe(concat.scripts, src.cwd + '.js', {cwd: path.join(src.cwd, 'scripts')})
    // .pipe(concat.scripts, function(path) {
    //   var dir = path.dirname.split(path.sep).pop();
    //   path.basename = dir !== src.cwd ? dir : pkg.name;
    //   path.extname = '.css';
    // }, {cwd: path.join(src.cwd, 'scripts')})
    .pipe(require('./sanitize')(gulp, config))
    .pipe(ngAnnotate)
    /* jshint camelcase: false */
    .pipe(uglify, {output: {beautify: true, indent_level: 2}, mangle: false, compress: false})
    .pipe(concat.header, config.banner)
    // .pipe(sourcemaps.write, '.')
    .pipe(gulp.dest, src.dest)
    .pipe(uglify)
    .pipe(rename, function(path) { path.extname = '.min.js'; })
    .pipe(concat.header, config.banner)
    // .pipe(sourcemaps.write, '.')
    .pipe(gulp.dest, src.dest);

};


