'use strict';

module.exports = function(gulp, config) {

  return {
    scripts: {
      sanitize: require('./channels/scripts/sanitize')(gulp, config),
      dist: require('./channels/scripts/dist')(gulp, config)
    },
    styles: {
      src: require('./channels/styles/src')(gulp, config),
      dist: require('./channels/styles/dist')(gulp, config)
    },
    views: {
      src: require('./channels/views/src')(gulp, config),
      dist: require('./channels/views/dist')(gulp, config),
      test: require('./channels/views/test')(gulp, config)
    },
    index: {
      src: require('./channels/index/src')(gulp, config),
      dist: require('./channels/index/dist')(gulp, config),
      libs: require('./channels/index/libs')(gulp, config)
    }
  };

};
