'use strict';

//
// Required modules

var combine = require('stream-combiner2');
var vfs = require('vinyl-fs');
var inject = require('gulp-inject');
var _ = require('lodash');
var safe = require('./../../helpers/safe');
var error = require('./../../helpers/error');

module.exports = function(_paths) {

  var paths = _paths ? _.defaults(_paths, this.paths) : this.paths;

  return combine.obj(
    safe(),
    inject(
      require('./helpers/bower').bind(this)(paths, {minify: false})
        .on('error', error('bower index injection')),
      {name: 'bower', addRootSlash: false}
    ),
    inject(
      vfs.src(paths.scripts, {cwd: paths.cwd, base: paths.cwd})
        .pipe(require('./../scripts/src').bind(this)())
        .on('error', error('scripts index injection')),
      {ignorePath: paths.tmp, addRootSlash: false}
    ),
    inject(
      vfs.src(paths.styles, {cwd: paths.cwd, base: paths.cwd})
        .pipe(require('./../styles/src').bind(this)())
        .on('error', error('styles index injection')),
      {ignorePath: paths.tmp, addRootSlash: false}
    ),
    require('./../views/base').bind(this)(),
    vfs.dest(paths.tmp)
  );

};
