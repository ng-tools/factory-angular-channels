'use strict';

//
// Required modules

var combine = require('stream-combiner2');
var gulpif = require('gulp-if');
var babel = require('gulp-babel');
var rename = require('gulp-rename');
var match = require('gulp-match');
module.exports = function() {
  var config = this;
  return combine.obj(
    gulpif(function(file) {
      var withBabel = config.transpilers && config.transpilers.scripts === 'babel';
      return !!match(file, withBabel ? '**/*.{es6,es,js}' : '**/*.{es6.js,es6,es}');
    }, babel(this.babel || {presets: ['babel-preset-es2015']})),
    gulpif('**/*.{es6.js,es6,es}', rename(function(file) { file.extname = '.js'; }))
  );
};
