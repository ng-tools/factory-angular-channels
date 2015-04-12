'use strict';

//
// Required modules

var combine = require('stream-combiner');
var gulpif = require('gulp-if');
var jade = require('gulp-jade');

module.exports = function() {
  return combine(
    gulpif('**/*.jade', jade({pretty: true}))
  );
};
