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
var merge = require('merge-stream');
var sort = require('sort-stream');

module.exports = function(gulp, config) {

  function bowerFilter(fileName) {
    fileName = fileName.replace(config.cwd, '');
    // if((new RegExp('/' + config.pkg.name + '/')).test(fileName)) return false;
    if(config.bower.exclude && config.bower.exclude.test(fileName)) return false;
    if(config.bower.filter && !config.bower.filter.test(fileName)) return false;
    return true;
  }

  return function ChannelFactory(src) {
    src = src || config.src;

    var bowerDirectory = src.bowerDirectory || path.join(config.cwd, src.cwd, 'bower_components');
    var bowerJson = src.bowerJson || path.join(config.cwd, 'bower.json');

    return combine(
      inject(
        merge(
          gulp.src(bowerFiles({filter: bowerFilter, paths: {bowerDirectory: bowerDirectory, bowerJson: bowerJson}}), {cwd: src.cwd, read: false}),
          gulp.src(config.bower.include || '[^.]', {cwd: src.cwd, read: false})
        ).pipe(sort(function(a, b) {
          if(!config.bower.include) return;
          if(config.bower.include.indexOf(path.relative(a.cwd, a.path))) return -1;
          else if(config.bower.include.indexOf(path.relative(b.cwd, b.path))) return 1;
          return 0;
        })),
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


