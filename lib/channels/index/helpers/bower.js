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

module.exports = function(paths, options) {
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

  function sortBowerFiles(files, dir) {
    return sort(function(a, b) {
      var includesA = _.includes(files, path.relative(a.cwd, a.path));
      var includesB = _.includes(files, path.relative(b.cwd, b.path));
      if(includesA) return dir;
      else if(includesB) return -dir;
      return 0;
    })
  }

  var bowerDirectory = paths.bowerDirectory || path.join(this.cwd, paths.cwd, 'bower_components');
  var bowerJson = paths.bowerJson || path.join(this.cwd, 'bower.json');

  return merge(
    vfs.src(bowerFiles({filter: bowerFilter, paths: {bowerDirectory: bowerDirectory, bowerJson: bowerJson}}), {cwd: paths.cwd}),
    vfs.src(bower.include || '[^.]', {cwd: paths.cwd}),
    vfs.src(bower.prepend || '[^.]', {cwd: paths.cwd}),
    vfs.src(bower.append || '[^.]', {cwd: paths.cwd})
  )
  .pipe(gulpif(!!bower.prepend, sortBowerFiles(bower.prepend, -1)))
  .pipe(gulpif(!!bower.append, sortBowerFiles(bower.prepend, 1)));

};
