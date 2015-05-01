'use strict';

//
// Required modules

var path = require('path');
var combine = require('stream-combiner2');
var vfs = require('vinyl-fs');
var sourcemaps = require('gulp-sourcemaps');
var cleancss = require('gulp-cleancss');
var concat = require('gulp-concat-util');
var gulpif = require('gulp-if');
var rename = require('gulp-rename');

module.exports = function() {
  var paths = this.paths, pkg = this.pkg;
  var useSourcemaps = this.sourcemaps !== false;
  return combine.obj(
    gulpif(useSourcemaps, sourcemaps.init()),
    require('./base').bind(this)(),
    gulpif(/^app/.test(this.type), concat(path.join('styles', paths.cwd + '.css'), {cwd: paths.cwd})),
    gulpif(/^com/.test(this.type), concat(pkg.name + '.css', {cwd: paths.cwd})),
    concat.header(this.banner),
    // sourcemaps.write('.'),
    vfs.dest(paths.dest),
    cleancss(),
    rename(function(path) { path.extname = '.min.css'; }),
    concat.header(this.banner),
    gulpif(useSourcemaps, sourcemaps.write('.')),
    vfs.dest(paths.dest)
  );
};


