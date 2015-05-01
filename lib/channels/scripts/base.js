'use strict';

//
// Required modules

var combine = require('stream-combiner2');
var gulpif = require('gulp-if');
var babel = require('gulp-babel');
var rename = require('gulp-rename');

module.exports = function() {
  return combine.obj(
    gulpif('**/*.{es6.js,es6,es}', babel()),
    gulpif('**/*.{es6.js,es6,es}', rename(function(path) { path.extname = '.js'; }))
  );
};
