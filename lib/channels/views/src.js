'use strict';

//
// Required modules

var path = require('path');
var combine = require('stream-combiner');

//
// Gulp modules

var transformify = require('gulp-transformify');
var gulpif = require('gulp-if');
var changed = require('gulp-changed');
// var jade = transformify(require('jade').render, {name: 'gulp-jade', ext: '.html'});
var jade = require('gulp-jade');

module.exports = function(gulp, config) {

  return function ChannelFactory(src) {
    src = src || config.src;
    return combine(
      // changed(src.tmp), // breaks index gulp-inject
      gulpif('**/*.jade', jade({pretty: true})),
      gulp.dest(src.tmp)
    );
  };

};
