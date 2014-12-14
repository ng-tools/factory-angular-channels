'use strict';

//
// Required modules

var combine = require('stream-combiner');

module.exports = function(gulp, config) {

  return function ChannelFactory(src) {
    src = src || config.src;
    return combine(
      require('./base')(gulp, config)(),
      gulp.dest(src.tmp)
    );
  };

};


