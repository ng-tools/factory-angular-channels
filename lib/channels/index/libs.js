'use strict';

//
// Required modules

var path = require('path');
var combine = require('stream-combiner');
var fs = require('fs');

//
// Gulp modules

var changed = require('gulp-changed');
var gulpif = require('gulp-if');
var jade = require('gulp-jade');
var plumber = require('gulp-plumber');
var concat = require('gulp-concat-util');
var through = require('through2');

module.exports = function(gulp, config, key) {

  var src = config[key || 'src'];

  return function ChannelFactory() {
    return combine(
      gulpif(config.usemin !== false, useminfile),
      gulpif('**/*.js', concat('libs.min.js', {cwd: path.join(src.cwd, 'scripts'), base: src.cwd})),
      gulpif('**/*.css', concat('libs.min.css', {cwd: path.join(src.cwd, 'styles'), base: src.cwd})),
      gulpif('**/*.{otf,eot,svg,ttf,woff}', through.obj(function(file, encoding, next) {
        var fileName = path.basename(file.path);
        file.base = src.cwd;
        file.cwd = src.cwd;
        file.path = path.join(file.base, 'fonts', fileName);
        next(null, file);
      })),
      gulp.dest(src.dest)
    );
  };

};

//
// Local helpers

var useminfile = through.obj(function(file, encoding, next) {
  var ext = path.extname(file.path);
  var base = path.basename(file.path, ext);
  var canBeMin = ext.match(/\.(?:js|css)$/);
  var isMin = base.match(/\.min\.(?:js|css)$/);
  // @TODO add sourcemap support
  if(canBeMin && !isMin) {
    var filePath = file.path.replace(new RegExp(ext + '$'), '.min' + ext);
    fs.readFile(filePath, function(err, contents) {
      if(err) return next(null, file);
      file.path = filePath;
      file.contents = contents;
      next(null, file);
    });
  } else {
    next(null, file);
  }
});
