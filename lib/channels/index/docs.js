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
var safe = require('./../../helpers/safe');
var error = require('./../../helpers/error');

module.exports = function() {

  var paths = this.paths;
  var docs = this.docs;

  // Override bower paths
  docs.bowerDirectory = path.join(this.cwd, docs.cwd, 'bower_components');
  docs.bowerJson = path.join(this.cwd, docs.cwd, 'bower.json');

  return combine.obj(
    safe(),
    require('./src').bind(this)(docs),
    inject(
      merge(
        vfs.src(paths.scripts, {cwd: paths.cwd, base: paths.cwd})
          .pipe(require('./../scripts/src').bind(this)({tmp: path.join(paths.tmp, paths.cwd)}))
          .pipe(gulpif('**/*.js', angularFilesort())),
        vfs.src(paths.styles, {cwd: paths.cwd, base: paths.cwd})
          .pipe(require('./../styles/src').bind(this)({tmp: path.join(paths.tmp, paths.cwd)}))
      ).on('error', error('docs source index injection')),
      {name: 'source', ignorePath: paths.tmp, addRootSlash: false}
    ),
    inject(
      vfs.src(paths.docsScripts, {cwd: paths.cwd, base: paths.cwd})
        .pipe(require('./../scripts/src').bind(this)({tmp: path.join(paths.tmp, paths.cwd)}))
        .pipe(gulpif('**/*.js', angularFilesort()))
        .on('error', error('docs scripts index injection')),
      {name: 'source-docs', ignorePath: paths.tmp, addRootSlash: false}
    ),
    vfs.dest(paths.tmp)
  );

};
