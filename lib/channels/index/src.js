'use strict';

//
// Required modules

var combine = require('stream-combiner2');
var vfs = require('vinyl-fs');
var inject = require('gulp-inject');
var angularFilesort = require('gulp-angular-filesort');
var gulpif = require('gulp-if');
var _ = require('lodash');
var chalk = require('chalk');

module.exports = function(paths) {

  paths = paths ? _.defaults(paths, this.paths) : this.paths;

  return combine.obj(
    inject(
      require('./helpers/bower').bind(this)(paths, {minify: false}),
      {name: 'bower', addRootSlash: false}
    ),
    inject(
      vfs.src(paths.scripts, {cwd: paths.cwd, base: paths.cwd})
        .pipe(require('./../scripts/src').bind(this)())
        .pipe(gulpif('**/*.js', angularFilesort()))
        .on('error', errorHandler),
      {ignorePath: paths.tmp, addRootSlash: false}
    ),
    inject(
      vfs.src(paths.styles, {cwd: paths.cwd, base: paths.cwd})
        .pipe(require('./../styles/src').bind(this)())
        .on('error', errorHandler),
      {ignorePath: paths.tmp, addRootSlash: false}
    ),
    require('./../views/base').bind(this)(),
    vfs.dest(paths.tmp)
  );
};

function errorHandler(err) {
  console.log('[' + chalk.grey(new Date().toLocaleTimeString()) + '] ' + err.toString() + (err.stack ? '\n' + err.stack : ''));
}
