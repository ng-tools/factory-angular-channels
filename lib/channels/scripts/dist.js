'use strict';

//
// Required modules

var path = require('path');
var combine = require('stream-combiner2');
var vfs = require('vinyl-fs');
var gulpif = require('gulp-if');
var concat = require('gulp-concat-util');
var ngAnnotate = require('gulp-ng-annotate');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');

module.exports = function() {
  var paths = this.paths, pkg = this.pkg;
  var useSourcemaps = this.sourcemaps !== false;
  return combine.obj(
    gulpif(useSourcemaps, sourcemaps.init()),
    require('./base').bind(this)(),
    gulpif(/^app/.test(this.type), concat.scripts(path.join('scripts', paths.cwd + '.js'), {cwd: paths.cwd, base: paths.cwd})),
    gulpif(/^com/.test(this.type), concat.scripts(pkg.name + '.js', {cwd: paths.cwd, base: paths.cwd})),
    gulpif(/^lib/.test(this.type), combine(
      concat.scripts((this.name || pkg.name) + '.js', {cwd: paths.cwd, base: paths.cwd, passthrough: this.passthrough}),
      rename(function(path) { if(path.dirname !== '.') path.dirname = 'modules'; })
    )),
    ngAnnotate({gulpWarnings: false}),
    uglify({output: {beautify: true, indent_level: 2/*, quote_style: 1*/}, mangle: false, compress: false}),
    concat.header(this.banner),
    vfs.dest(paths.dest),
    gulpif(this.usemin !== false, uglify({output: {indent_level: 2/*, quote_style: 1*/}})),
    concat.header(this.banner),
    rename(function(path) { path.extname = '.min.js'; }),
    gulpif(useSourcemaps, sourcemaps.write('.')),
    vfs.dest(paths.dest)
  );
};
