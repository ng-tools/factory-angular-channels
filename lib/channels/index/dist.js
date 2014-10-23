'use strict';

//
// Required modules

var path = require('path');
var lazypipe = require('lazypipe');

//
// Gulp modules

var changed = require('gulp-changed');
var jade = require('gulp-jade');
var nginclude = require('gulp-nginclude');
var gulpif = require('gulp-if');
var inject = require('gulp-inject');
var bowerFiles = require('main-bower-files');
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
        gulp.src(bowerFiles({filter: bowerFilter}), {cwd: src.cwd, read: true})
          .pipe(require('./libs')(gulp, config)()),
        {name: 'bower', ignorePath: src.dest, addRootSlash: false}
      );
    })
    .pipe(function() {
      return inject(
        gulp.src(src.views, {cwd: src.cwd, base: src.cwd})
          .pipe(require('./../views/dist')(gulp, config)()),
        {name: 'views', ignorePath: src.dest, addRootSlash: false}
      );
    })
    .pipe(function() {
      return inject(
        gulp.src(src.scripts, {cwd: src.cwd, base: src.cwd})
          .pipe(angularFilesort())
          .pipe(require('./../scripts/dist')(gulp, config)()),
        {ignorePath: src.dest, addRootSlash: false}
      );
    })
    .pipe(function() {
      return inject(
        gulp.src(src.styles, {cwd: src.cwd, base: src.cwd})
          .pipe(require('./../styles/dist')(gulp, config)()),
        {ignorePath: src.dest, addRootSlash: false}
      );
    })
    .pipe(function() {
      return gulpif('**/*.jade', jade({pretty: true}));
    })
    .pipe(nginclude, {assetsDirs: [src.tmp]})
    .pipe(gulp.dest, src.dest);

};


