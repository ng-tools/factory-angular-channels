'use strict';

//
// Required modules

var path = require('path');
var lazypipe = require('lazypipe');

//
// Gulp modules

var inject = require('gulp-inject');
var bowerFiles = require('main-bower-files');
var bowerFilter = function(file) { return !/jquery|js\/bootstrap/.test(file); };
var angularFilesort = require('gulp-angular-filesort');

module.exports = function(gulp, config) {

  function bowerFilter(fileName) {
    if(config.bower.exclude && config.bower.exclude.test(fileName)) return false;
    if(config.bower.filter && !config.bower.filter.test(fileName)) return false;
    return true;
  }

  var src = config.src;
  return lazypipe()
    .pipe(function() {
      return inject(
        gulp.src(bowerFiles({filter: bowerFilter}), {cwd: src.cwd, read: false}),
        {name: 'bower', addRootSlash: false}
      );
    })
    .pipe(function() {
      return inject(
        gulp.src(src.scripts, {cwd: src.cwd, base: src.cwd})
          .pipe(angularFilesort()),
        {ignorePath: src.cwd, addRootSlash: false}
      );
    })
    .pipe(function() {
      return inject(
        gulp.src(src.styles, {cwd: src.cwd, base: src.cwd})
          .pipe(debug())
          .pipe(require('./../styles/src')(gulp, config)()),
        {ignorePath: src.tmp, addRootSlash: false}
      );
    })
    .pipe(require('./../views/src')(gulp, config))
    .pipe(gulp.dest, src.tmp);

};


