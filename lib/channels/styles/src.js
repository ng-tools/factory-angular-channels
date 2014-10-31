'use strict';

//
// Required modules

var combine = require('stream-combiner');
var changed = require('gulp-changed');

module.exports = function(gulp, config) {

  var src = config.src;
  return function ChannelFactory() {
    return combine(
      // changed(src.tmp), // breaks index gulp-inject
      require('./base')(gulp, config)(),
      gulp.dest(src.tmp)
    );
  };

};


