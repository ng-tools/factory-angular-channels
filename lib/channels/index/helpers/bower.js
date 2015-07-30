'use strict';

//
// Required modules

var _ = require('lodash');
var merge = require('merge2');
var path = require('path');
var vfs = require('vinyl-fs');
var bowerFiles = require('main-bower-files');
var gulpif = require('gulp-if');
var sort = require('sort-stream');

module.exports = function(paths) {
  paths = paths ? _.defaults(paths, this.paths) : this.paths;
  var bower = this.bower;

  function bowerFilter(fileName) {
    fileName = fileName.replace(paths.cwd, '');
    // var extname = path.extname(fileName);
    // d(extname);
    if(bower.exclude && bower.exclude.test(fileName)) return false;
    if(bower.filter && !bower.filter.test(fileName)) return false;
    return true;
  }

  var bowerDirectory = paths.bowerDirectory || path.join(this.cwd, paths.cwd, 'bower_components');
  var bowerJson = paths.bowerJson || path.join(this.cwd, 'bower.json');

  return merge(
    vfs.src(bowerFiles({filter: bowerFilter, paths: {bowerDirectory: bowerDirectory, bowerJson: bowerJson}}), {cwd: paths.cwd, read: false}),
    vfs.src(bower.include || '[^.]', {cwd: paths.cwd, read: false})
  ).pipe(gulpif(bower.include, sort(function(a, b) {
    if(bower.include.indexOf(path.relative(a.cwd, a.path))) return -1;
    else if(bower.include.indexOf(path.relative(b.cwd, b.path))) return 1;
    return 0;
  })));

};
