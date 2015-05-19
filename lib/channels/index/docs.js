'use strict';

//
// Required modules

var path = require('path');
var combine = require('stream-combiner2');
var vfs = require('vinyl-fs');
var inject = require('gulp-inject');
var bowerFiles = require('main-bower-files');
var angularFilesort = require('gulp-angular-filesort');
var gulpif = require('gulp-if');
var merge = require('merge-stream');
var rename = require('gulp-rename');

module.exports = function(paths) {

  paths = paths || this.paths;
  var pkg = this.pkg, bower = this.bower;
  var docs = this.docs;

  docs.bowerJson = path.join(this.cwd, docs.cwd, 'bower.json');

  return combine.obj(
    require('./src').bind(this)(docs),
    inject(
      merge(
        vfs.src(paths.scripts, {cwd: paths.cwd, base: paths.cwd})
          .pipe(rename(function(path) { path.dirname = 'src/' + path.dirname; }))
          .pipe(require('./../scripts/src').bind(this)())
          .pipe(gulpif('**/*.js', angularFilesort())),
      vfs.src(paths.styles, {cwd: paths.cwd, base: paths.cwd})
          .pipe(rename(function(path) { path.dirname = 'src/' + path.dirname; }))
          .pipe(require('./../styles/src').bind(this)())
      ),
      {name: 'source', ignorePath: paths.tmp, addRootSlash: false}
    ),
    inject(
      vfs.src(paths.docsScripts, {cwd: paths.cwd, base: paths.cwd})
        .pipe(rename(function(path) { path.dirname = 'src/' + path.dirname; }))
        .pipe(require('./../scripts/src').bind(this)())
        .pipe(gulpif('**/*.js', angularFilesort())),
      {name: 'source-docs', ignorePath: paths.tmp, addRootSlash: false}
    ),
    vfs.dest(paths.tmp)
  );

};
