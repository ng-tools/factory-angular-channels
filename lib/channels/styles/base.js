'use strict';

//
// Required modules

var combine = require('stream-combiner2');
var gulpif = require('gulp-if');
var less = require('gulp-less');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');

module.exports = function() {
  return combine.obj(
    gulpif('**/*.less', less(this.less)),
    gulpif('**/*.{sass,scss}', sass(this.sass)),
    postcss([autoprefixer({browsers: ['last 2 versions']})])
  );
};
