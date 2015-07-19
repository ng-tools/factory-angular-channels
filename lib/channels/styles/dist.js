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
var _ = require('lodash');

module.exports = function(paths) {
  paths = paths ? _.defaults(paths, this.paths) : this.paths;
  var pkg = this.pkg;
  var useSourcemaps = this.sourcemaps !== false;
  return combine.obj(
    gulpif(useSourcemaps, sourcemaps.init()),
    require('./base').bind(this)(),
    gulpif(/^app/.test(this.type), concat(path.join('styles', paths.cwd + '.css'), {cwd: paths.cwd})),
    gulpif(/^com/.test(this.type), concat((this.name || pkg.name) + '.css', {cwd: paths.cwd})),
    gulpif(/^lib/.test(this.type), combine.obj(
      concat((this.name || pkg.name) + '.css', {cwd: paths.cwd, base: paths.cwd, passthrough: true}),
      rename(function(file) { if(file.dirname !== '.') file.dirname = 'modules'; })
    )),
    concat.header(this.banner),
    vfs.dest(paths.dest),
    cleancss(),
    rename(function(file) { file.extname = '.min.css'; }),
    concat.header(this.banner),
    gulpif(useSourcemaps, sourcemaps.write('.')),
    vfs.dest(paths.dest)
  );
};


