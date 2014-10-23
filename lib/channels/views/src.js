'use strict';

//
// Required modules

var path = require('path');
var combine = require('stream-combiner');

//
// Gulp modules

var gulpif = require('gulp-if');
var jade = require('gulp-jade');

module.exports = function(gulp, config) {

  var src = config.src;
  return function ChannelFactory() {
    return combine(
      gulpif('**/*.jade', jade({pretty: true})),
      gulp.dest(src.tmp)
    );
  };

};


