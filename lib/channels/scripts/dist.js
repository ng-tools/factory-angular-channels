'use strict';

//
// Required modules

var path = require('path');
var combine = require('stream-combiner');

//
// Gulp modules

var gulpif = require('gulp-if');
var concat = require('gulp-concat-util');
var ngAnnotate = require('gulp-ng-annotate');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');

module.exports = function(gulp, config) {
  return function ChannelFactory(src) {
    src = src || config.src;
    // if using applicaiton mode, output script in a scripts subfolder
    return combine(
        gulpif(config.sourcemaps !== false, sourcemaps.init()),
        require('./base')(gulp, config)(),
        gulpif(/^app/.test(config.type), concat.scripts(path.join('scripts', src.cwd + '.js'), {cwd: src.cwd, base: src.cwd})),
        gulpif(/^com/.test(config.type), concat.scripts(config.pkg.name + '.js', {cwd: src.cwd, base: src.cwd})),
        gulpif(/^lib/.test(config.type), combine(
          concat.scripts(config.pkg.name + '.js', {cwd: src.cwd, base: src.cwd, passthrough: true}),
          rename(function(path) { if(path.dirname !== '.') path.dirname = 'modules'; })
        )),
        ngAnnotate({gulpWarnings: false}),
        uglify({output: {beautify: true, indent_level: 2/*, quote_style: 1*/}, mangle: false, compress: false}),
        concat.header(config.banner),
        gulp.dest(src.dest),
        uglify({output: {indent_level: 2/*, quote_style: 1*/}}),
        concat.header(config.banner),
        rename(function(path) { path.extname = '.min.js'; }),
        gulpif(config.sourcemaps !== false, sourcemaps.write('.')),
        gulp.dest(src.dest)
    );
  };
};
