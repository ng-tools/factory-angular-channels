'use strict';

//
// Required modules

var vfs = require('vinyl-fs');
var combine = require('stream-combiner2');
var sourcemaps = require('gulp-sourcemaps');
var gulpif = require('gulp-if');
var angularFilesort = require('gulp-angular-filesort');
var _ = require('lodash');

module.exports = function(_paths) {
  var paths = _paths ? _.defaults(_paths, this.paths) : this.paths;
  var useSourcemaps = ['dev', true].indexOf(this.sourcemaps) !== -1;
  return combine.obj(
    gulpif(useSourcemaps, sourcemaps.init()),
    require('./base').bind(this)(),
    gulpif(useSourcemaps, sourcemaps.write('.', {includeContent: false, debug: true, sourceRoot: '/'})),
    gulpif('*.js', angularFilesort()),
    vfs.dest(paths.tmp)
  );
};
