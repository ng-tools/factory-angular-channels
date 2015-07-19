'use strict';

//
// Required modules

var path = require('path');
var combine = require('stream-combiner2');
var vfs = require('vinyl-fs');
var changed = require('gulp-changed');
var jade = require('gulp-jade');
var nginclude = require('gulp-nginclude');
var gulpif = require('gulp-if');
var inject = require('gulp-inject');
var bowerFiles = require('main-bower-files');
var angularFilesort = require('gulp-angular-filesort');
var _ = require('lodash');
var merge = require('merge-stream');
var sort = require('sort-stream');

module.exports = function(paths) {

  paths = paths ? _.defaults(paths, this.paths) : this.paths;
  var pkg = this.pkg, bower = this.bower;

  function bowerFilter(fileName) {
    fileName = fileName.replace(paths.cwd, '');
    // if((new RegExp('/' + config.pkg.name + '/')).test(fileName)) return false;
    if(bower.exclude && bower.exclude.test(fileName)) return false;
    if(bower.filter && !bower.filter.test(fileName)) return false;
    return true;
  }

  var bowerDirectory = paths.bowerDirectory || path.join(this.cwd, paths.cwd, 'bower_components');
  var bowerJson = paths.bowerJson || path.join(this.cwd, 'bower.json');

  return combine.obj(
    inject(
      merge(
        vfs.src(bowerFiles({filter: bowerFilter, paths: {bowerDirectory: bowerDirectory, bowerJson: bowerJson}}), {cwd: paths.cwd, read: true}),
        vfs.src(bower.include || '[^.]', {cwd: paths.cwd, read: true})
      ).pipe(gulpif(bower.include, sort(function(a, b) {
        if(bower.include.indexOf(path.relative(a.cwd, a.path))) return -1;
        else if(bower.include.indexOf(path.relative(b.cwd, b.path))) return 1;
        return 0;
      }))).pipe(require('./libs').bind(this)()),
      {name: 'bower', ignorePath: paths.dest, addRootSlash: false, transform: function(filePath) {
        // Support jsdelivr files pulled from ./libs transform
        var args = Array.prototype.slice.call(arguments);
        if (/cdn\.jsdelivr\.net/.test(filePath)) {
          args[0] = '//' + args[0];
        }
        return inject.transform.apply(inject.transform, args);
      }}
    ),
    inject(
      vfs.src(paths.views, {cwd: paths.cwd, base: paths.cwd})
        .pipe(require('./../views/dist').bind(this)()),
      {name: 'views', ignorePath: paths.dest, addRootSlash: false}
    ),
    inject(
      vfs.src(paths.scripts, {cwd: paths.cwd, base: paths.cwd})
        .pipe(require('./../scripts/dist').bind(this)())
        .pipe(gulpif('**/*.js', angularFilesort())),
      {ignorePath: paths.dest, addRootSlash: false}
    ),
    inject(
      vfs.src(paths.styles, {cwd: paths.cwd, base: paths.cwd})
        .pipe(require('./../styles/dist').bind(this)()),
      {ignorePath: paths.dest, addRootSlash: false}
    ),
    require('./../views/base').bind(this)(),
    nginclude({assetsDirs: paths.assetsDirs || [paths.tmp]}),
    vfs.dest(paths.dest)
  );

};
