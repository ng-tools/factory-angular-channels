'use strict';

//
// Required modules

var combine = require('stream-combiner2');
var vfs = require('vinyl-fs');
var nginclude = require('gulp-nginclude');
var inject = require('gulp-inject');
var _ = require('lodash');
var size = require('gulp-size');
var safe = require('./../../helpers/safe');
var error = require('./../../helpers/error');

module.exports = function(_paths) {

  var paths = _paths ? _.defaults(_paths, this.paths) : this.paths;

  return combine.obj(
    safe(),
    inject(
      require('./helpers/bower').bind(this)(paths, {minify: true})
        .pipe(require('./helpers/libs').bind(this, {minify: true})())
        .on('error', error('bower index injection')),
      {name: 'bower', ignorePath: paths.dest, addRootSlash: false, transform: addUrlSupport}
    ),
    inject(
      vfs.src(paths.views, {cwd: paths.cwd, base: paths.cwd})
        .pipe(require('./../views/dist').bind(this)())
        .on('error', error('views index injection')),
      {name: 'views', ignorePath: paths.dest, addRootSlash: false}
    ),
    inject(
      vfs.src(paths.scripts, {cwd: paths.cwd, base: paths.cwd})
        .pipe(require('./../scripts/dist').bind(this)())
        .pipe(size({showFiles: true, gzip: true}))
        .on('error', error('scripts index injection')),
      {ignorePath: paths.dest, addRootSlash: false}
    ),
    inject(
      vfs.src(paths.styles, {cwd: paths.cwd, base: paths.cwd})
        .pipe(require('./../styles/dist').bind(this)())
        .on('error', error('styles index injection')),
      {ignorePath: paths.dest, addRootSlash: false}
    ),
    require('./../views/base').bind(this)(),
    nginclude({assetsDirs: paths.assetsDirs || [paths.tmp]}),
    vfs.dest(paths.dest)
  );

};

function addUrlSupport(filePath) {
  // Support jsdelivr files pulled from `libs` transform
  var args = Array.prototype.slice.call(arguments);
  if (/cdn\.jsdelivr\.net/.test(filePath)) {
    args[0] = '//' + args[0];
  }
  return inject.transform.apply(inject.transform, args);
}
