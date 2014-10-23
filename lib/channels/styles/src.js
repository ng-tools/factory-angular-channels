'use strict';

//
// Required modules

var combine = require('stream-combiner');

module.exports = function(gulp, config) {

  var src = config.src;
  return function ChannelFactory() {
    return combine(
      require('./base')(gulp, config)(),
      gulp.dest(src.tmp)
    );
  };

};


