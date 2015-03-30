'use strict';

//
// Required modules

var path = require('path');
var combine = require('stream-combiner');

//
// Gulp modules

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

module.exports = function(gulp, config) {

  function bowerFilter(fileName) {
    fileName = fileName.replace(config.cwd, '');
    // if((new RegExp('/' + config.pkg.name + '/')).test(fileName)) return false;
    if(config.bower.exclude && config.bower.exclude.test(fileName)) return false;
    if(config.bower.filter && !config.bower.filter.test(fileName)) return false;
    return true;
  }

  return function ChannelFactory(src, options) {
    config = _.defaults(options || {}, config);
    src = src || config.src;

    var bowerDirectory = src.bowerDirectory || path.join(config.cwd, src.cwd, 'bower_components');
    var bowerJson = src.bowerJson || path.join(config.cwd, 'bower.json');

    return combine(
      inject(
        merge(
          gulp.src(bowerFiles({filter: bowerFilter, paths: {bowerDirectory: bowerDirectory, bowerJson: bowerJson}}), {cwd: src.cwd, read: true}),
          gulp.src(config.bower.include || '', {cwd: src.cwd, read: false})
        ).pipe(gulpif(config.bower.include, sort(function(a, b) {
          if(config.bower.include.indexOf(path.relative(a.cwd, a.path))) return -1;
          else if(config.bower.include.indexOf(path.relative(b.cwd, b.path))) return 1;
          return 0;
        }))).pipe(require('./libs')(gulp, config)(src)),
        {name: 'bower', ignorePath: src.dest, addRootSlash: false, transform: function(filePath) {
          // Support jsdelivr files pulled from ./libs transform
          var args = Array.prototype.slice.call(arguments);
          if (/cdn\.jsdelivr\.net/.test(filePath)) {
            args[0] = '//' + args[0];
          }
          return inject.transform.apply(inject.transform, args);
        }}
      ),
      inject(
        gulp.src(src.views, {cwd: src.cwd, base: src.cwd})
          .pipe(require('./../views/dist')(gulp, config)(src, options)),
        {name: 'views', ignorePath: src.dest, addRootSlash: false}
      ),
      inject(
        gulp.src(src.scripts, {cwd: src.cwd, base: src.cwd})
          .pipe(require('./../scripts/dist')(gulp, config)(src, options))
          .pipe(gulpif('**/*.js', angularFilesort())),
        {ignorePath: src.dest, addRootSlash: false}
      ),
      inject(
        gulp.src(src.styles, {cwd: src.cwd, base: src.cwd})
          .pipe(require('./../styles/dist')(gulp, config)(src)),
        {ignorePath: src.dest, addRootSlash: false}
      ),
      gulpif('**/*.jade', jade({pretty: true})),
      nginclude({assetsDirs: config.assetsDirs || [src.tmp]}),
      gulp.dest(src.dest)
    );
  };

};


