'use strict';

//
// Required modules

var path = require('path');
var combine = require('stream-combiner2');
var fs = require('fs');
var vfs = require('vinyl-fs');
var fs = require('fs');
var changed = require('gulp-changed');
var gulpif = require('gulp-if');
var jade = require('gulp-jade');
var concat = require('gulp-concat-util');
var through = require('through2');
var _ = require('lodash');

module.exports = function() {
  var config = this, paths = this.paths;

  var concatTransform = combine.obj(
    gulpif(config.usemin !== false, useminfile),
    gulpif('**/*.js', concat('libs.min.js', {cwd: path.join(paths.cwd, 'scripts'), base: paths.cwd})),
    gulpif('**/*.css', concat('libs.min.css', {cwd: path.join(paths.cwd, 'styles'), base: paths.cwd})),
    gulpif('**/*.{otf,eot,svg,ttf,woff,woff2}', flattenFiles('fonts', paths)),
    vfs.dest(paths.dest)
  );

  var bowerDirectory = paths.bowerDirectory || path.join(this.cwd, paths.cwd, 'bower_components');
  var bowerJson = paths.bowerJson || path.join(this.cwd, 'bower.json');

  var deps = config.cdn ? JSON.parse(fs.readFileSync(bowerJson)).dependencies : {};
  var cdn = config.cdn ? require('./cdn') : {};

  return gulpif(function(file) {
    if(!config.cdn) return;
    var filePath = file.path.replace(bowerDirectory, '').substr(1);
    var libName = filePath.split('/').shift();
    return cdn[libName];
  }, through.obj(function(file, encoding, next) {
    file.path = file.path.replace(bowerDirectory, '').substr(1);
    var libName = file.path.split('/').shift();
    file.path = cdn[libName](file, deps[libName]);
    file.cwd = '/';
    next(null, file);
  }), concatTransform);

};

//
// Local helpers

function flattenFiles(dest, paths) {
  return through.obj(function(file, encoding, next) {
    var fileName = path.basename(file.path);
    file.base = paths.cwd;
    file.cwd = paths.cwd;
    file.path = path.join(file.base, dest, fileName);
    next(null, file);
  });
}

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
