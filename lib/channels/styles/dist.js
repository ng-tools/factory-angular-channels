'use strict';

//
// Required modules

var path = require('path');
var combine = require('stream-combiner');

//
// Gulp modules

var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat-util');
var cleancss = require('gulp-cleancss');
var concat = require('gulp-concat-util');
var gulpif = require('gulp-if');
var rename = require('gulp-rename');

module.exports = function(gulp, config) {
  return function ChannelFactory(src) {
    src = src || config.src;
    return combine(
      gulpif(config.sourcemaps !== true, sourcemaps.init()),
      require('./base')(gulp, config)(),
      gulpif(/^app/.test(config.type), concat(path.join('styles', src.cwd + '.css'), {cwd: src.cwd})),
      gulpif(/^com/.test(config.type), concat(config.pkg.name + '.css', {cwd: src.cwd})),
      concat.header(config.banner),
      // sourcemaps.write('.'),
      gulp.dest(src.dest),
      cleancss(),
      rename(function(path) { path.extname = '.min.css'; }),
      concat.header(config.banner),
      gulpif(config.sourcemaps !== true, sourcemaps.write('.')),
      gulp.dest(src.dest)
    );
  };
};


