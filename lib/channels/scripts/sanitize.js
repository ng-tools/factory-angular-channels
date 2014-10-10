'use strict';

//
// Required modules

var path = require('path');
var lazypipe = require('lazypipe');
var eol = require('os').EOL;

//
// Gulp modules

var concat = require('gulp-concat-util');

module.exports = function(src, options) {

  return lazypipe()
    .pipe(concat.header, ['(function(window, document, undefined) {', eol, '\'use strict\';', eol].join(''))
    .pipe(concat.footer, [eol, eol, '})(window, document);', eol].join(''));

};


