'use strict';

//
// Required modules

var combine = require('stream-combiner');
var gulpif = require('gulp-if');
var babel = require('gulp-babel');
var rename = require('gulp-rename');

module.exports = function() {
  return combine(
    gulpif('**/*.{es6.js,es6,es}', babel()),
    gulpif('**/*.{es6.js,es6,es}', rename(function(path) { path.extname = '.js'; }))
  );
};
