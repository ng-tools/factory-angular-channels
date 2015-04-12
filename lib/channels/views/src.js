'use strict';

//
// Required modules

var path = require('path');
var combine = require('stream-combiner');

//
// Gulp modules

var gulpif = require('gulp-if');
var vfs = require('vinyl-fs');
// var transformify = require('gulp-transformify');
// var jade = transformify(require('jade').render, {name: 'gulp-jade', ext: '.html'});
var jade = require('gulp-jade');

module.exports = function() {
  var paths = this.paths;
  return combine(
    require('./base').bind(this)(),
    vfs.dest(paths.tmp)
  );
};
