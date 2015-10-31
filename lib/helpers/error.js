
'use strict';

var log = require('./log');
var util = require('util');
var chalk = require('chalk');

module.exports = function errorHandlerFactory(name) {
  return function errorHandler(err) {
    log(chalk.red(util.format('An error occured while processing "%s", some files may have not been properly processed.', name)));
    log(err.toString() + (err.stack ? '\n' + err.stack : ''));
  };
};
