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
var _ = require('lodash');

module.exports = function() {
  var config = this, paths = this.paths;
  var pkg = this.pkg, bower = this.bower;
  var docs = this.docs;

  docs.bowerJson = path.join(this.cwd, docs.cwd, 'bower.json');
  docs.assetsDirs = [docs.tmp, this.paths.cwd];

  var selfAsComponent = _.defaults({type: 'component', name: pkg.name}, this);
  var selfAsDocsComponent = _.defaults({type: 'component', name: pkg.name + '.docs'}, this);

  return combine.obj(
    require('./dist').bind(_.defaults({type: 'application', paths: docs}, this))(),
    inject(
      merge(
        vfs.src(paths.scripts, {cwd: paths.cwd, base: paths.cwd})
          .pipe(require('./../scripts/dist').bind(selfAsComponent)({dest: path.join(docs.dest, 'dist')})),
        vfs.src(paths.styles, {cwd: paths.cwd, base: paths.cwd})
          .pipe(require('./../styles/dist').bind(selfAsComponent)({dest: path.join(docs.dest, 'dist')})),
        vfs.src(paths.templates, {cwd: paths.cwd, base: paths.cwd})
          .pipe(require('./../views/dist').bind(selfAsComponent)({dest: path.join(docs.dest, 'dist')}))
      ).pipe(gulpif('**/*.js', angularFilesort())),
      {name: 'source', ignorePath: docs.dest, addRootSlash: false}
    ),
    inject(
      merge(
        vfs.src(paths.docsScripts, {cwd: paths.cwd, base: paths.cwd})
          .pipe(require('./../scripts/dist').bind(selfAsDocsComponent)({dest: path.join(docs.dest, 'docs')})),
        vfs.src(paths.docsTemplates, {cwd: paths.cwd, base: paths.cwd})
          .pipe(require('./../views/dist').bind(selfAsDocsComponent)({dest: path.join(docs.dest, 'docs')}))
      ).pipe(gulpif('**/*.js', angularFilesort())),
      {name: 'source-docs', ignorePath: docs.dest, addRootSlash: false}
    ),
    vfs.dest(docs.dest)
  );

};
