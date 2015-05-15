'use strict';

//
// Required modules

var path = require('path'), _path = path;
var combine = require('stream-combiner2');
var vfs = require('vinyl-fs');
var inject = require('gulp-inject');
var bowerFiles = require('main-bower-files');
var angularFilesort = require('gulp-angular-filesort');
var gulpif = require('gulp-if');
var merge = require('merge-stream');
var rename = require('gulp-rename');
var _ = require('lodash');

module.exports = function(paths) {

  paths = paths || this.paths;
  var pkg = this.pkg, bower = this.bower;
  var docs = this.docs;

  docs.bowerJson = path.join(this.cwd, docs.cwd, 'bower.json');
  docs.assetsDirs = [docs.tmp, this.paths.cwd];

  return combine.obj(
    require('./dist').bind(_.defaults({type: 'application', paths: docs}, this))(),
    inject(
      merge(
        vfs.src(paths.scripts, {cwd: paths.cwd, base: paths.cwd})
          .pipe(require('./../scripts/dist').bind(_.defaults({type: 'component', dest: path.join(docs.dest, 'dist'), name: pkg.name}, this))()),
        vfs.src(paths.templates, {cwd: paths.cwd, base: paths.cwd})
          .pipe(require('./../views/dist').bind(_.defaults({type: 'component', dest: path.join(docs.dest, 'dist'), name: pkg.name}, this))())
      ).pipe(gulpif('**/*.js', angularFilesort())),
      {name: 'source', ignorePath: docs.dest, addRootSlash: false}
    ),
    inject(
      merge(
        vfs.src(paths.docsScripts, {cwd: paths.cwd, base: paths.cwd})
          .pipe(require('./../scripts/dist').bind(_.defaults({type: 'component', dest: path.join(docs.dest, 'dist'), name: pkg.name + '.docs'}, this))()),
        vfs.src(paths.docsTemplates, {cwd: paths.cwd, base: paths.cwd})
          .pipe(require('./../views/dist').bind(_.defaults({type: 'component', dest: path.join(docs.dest, 'dist'), name: pkg.name + '.docs'}, this))())
      ).pipe(gulpif('**/*.js', angularFilesort())),
      {name: 'source-docs', ignorePath: docs.dest, addRootSlash: false}
    ),
    vfs.dest(docs.dest)
  );

};
