'use strict';

//
// Required modules

var path = require('path');
var combine = require('stream-combiner2');
var vfs = require('vinyl-fs');
var inject = require('gulp-inject');
var angularFilesort = require('gulp-angular-filesort');
var gulpif = require('gulp-if');
var merge = require('merge-stream');
var _ = require('lodash');
var safe = require('./../../helpers/safe');
var error = require('./../../helpers/error');

module.exports = function() {
  var paths = this.paths;
  var pkg = this.pkg;
  var docs = this.docs;

  var selfAsComponent = _.defaults({type: 'component', name: pkg.name}, this);
  var selfAsDocsComponent = _.defaults({type: 'component', name: pkg.name + '.docs'}, this);

  docs.bowerJson = path.join(this.cwd, docs.cwd, 'bower.json');
  docs.assetsDirs = [docs.tmp, this.paths.cwd];

  return combine.obj(
    safe(),
    inject(
      merge(
        vfs.src(paths.scripts, {cwd: paths.cwd, base: paths.cwd})
          .pipe(require('./../scripts/dist').bind(selfAsComponent)({dest: path.join(docs.dest, 'dist')})),
        vfs.src(paths.styles, {cwd: paths.cwd, base: paths.cwd})
          .pipe(require('./../styles/dist').bind(selfAsComponent)({dest: path.join(docs.dest, 'dist')})),
        vfs.src(paths.templates, {cwd: paths.cwd, base: paths.cwd})
          .pipe(require('./../views/dist').bind(selfAsComponent)({dest: path.join(docs.dest, 'dist')}))
      ).pipe(gulpif('**/*.js', angularFilesort()))
        .on('error', error('pages source index injection')),
      {name: 'source', ignorePath: docs.dest, addRootSlash: false}
    ),
    inject(
      merge(
        vfs.src(paths.docsScripts, {cwd: paths.cwd, base: paths.cwd})
          .pipe(require('./../scripts/dist').bind(selfAsDocsComponent)({dest: path.join(docs.dest, 'docs')})),
        vfs.src(paths.docsTemplates, {cwd: paths.cwd, base: paths.cwd})
          .pipe(require('./../views/dist').bind(selfAsDocsComponent)({dest: path.join(docs.dest, 'docs')}))
      ).pipe(gulpif('**/*.js', angularFilesort()))
        .on('error', error('docs scripts index injection')),
      {name: 'source-docs', ignorePath: docs.dest, addRootSlash: false}
    ),
    require('./dist').bind(_.defaults({type: 'application', paths: docs}, this))(),
    vfs.dest(docs.dest)
  );

};
