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
var jade = transformify(Promise.promisify(require('jade').render), {name: 'gulp-jade', ext: '.html'});
// var jade = require('gulp-jade');

module.exports = function(gulp, config) {

  var src = config.src;
  return function ChannelFactory() {
    return combine(
      changed(src.tmp),
      gulpif('**/*.jade', jade({pretty: true})),
      gulp.dest(src.tmp)
    );
  };

};
