'use strict';

//
// Required modules

var vfs = require('vinyl-fs');
var combine = require('stream-combiner2');
var sourcemaps = require('gulp-sourcemaps');
var gulpif = require('gulp-if');

module.exports = function() {
  var paths = this.paths;
  var useSourcemaps = ['dev', true].indexOf(this.sourcemaps) !== -1;
  return combine.obj(
    gulpif(useSourcemaps, sourcemaps.init()),
    require('./base').bind(this)(),
    gulpif(useSourcemaps, sourcemaps.write('', {includeContent: false, sourceRoot: '..'})),
    vfs.dest(paths.tmp)
  );
};
