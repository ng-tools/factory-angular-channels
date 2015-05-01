'use strict';

//
// Required modules

var combine = require('stream-combiner2');
var gulpif = require('gulp-if');
var jade = require('gulp-jade');

module.exports = function() {
  return combine.obj(
    gulpif('**/*.jade', jade({pretty: true}))
  );
};
