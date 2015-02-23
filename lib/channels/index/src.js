'use strict';

//
// Required modules

var path = require('path');
var combine = require('stream-combiner');

//
// Gulp modules

var inject = require('gulp-inject');
var bowerFiles = require('main-bower-files');
var angularFilesort = require('gulp-angular-filesort');
var gulpif = require('gulp-if');

module.exports = function(gulp, config) {

  function bowerFilter(fileName) {
    if(config.bower.exclude && config.bower.exclude.test(fileName)) return false;
    if(config.bower.filter && !config.bower.filter.test(fileName)) return false;
    return true;
  }

  return function ChannelFactory(src) {
    src = src || config.src;
    return combine(
      inject(
        gulp.src(bowerFiles({filter: bowerFilter, paths: {bowerDirectory: src.bowerDirectory || path.join(config.cwd, src.cwd, 'bower_components'), bowerJson: src.bowerJson || path.join(config.cwd, 'bower.json')}}), {cwd: src.cwd, read: false}),
        {name: 'bower', addRootSlash: false}
      ),
      inject(
        gulp.src(src.scripts, {cwd: src.cwd, base: src.cwd})
          .pipe(require('./../scripts/src')(gulp, config)())
          .pipe(gulpif('**/*.js', angularFilesort())),
        {ignorePath: src.tmp, addRootSlash: false}
      ),
      inject(
        gulp.src(src.styles, {cwd: src.cwd, base: src.cwd})
          .pipe(require('./../styles/src')(gulp, config)()),
        {ignorePath: src.tmp, addRootSlash: false}
      ),
      require('./../views/src')(gulp, config)(),
      gulp.dest(src.tmp)
    );
  };

};


