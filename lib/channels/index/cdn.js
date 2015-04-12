'use strict';

module.exports = {
  'angular': function(file, version) {
    version = version.replace(/[^0-9\.\-]/g, '');
    return '//cdn.jsdelivr.net/angularjs/' + version + '/angular.min.js';
  },
  'angular-animate': function(file, version) {
    version = version.replace(/[^0-9\.\-]/g, '');
    return '//cdn.jsdelivr.net/angularjs/' + version + '/angular-animate.min.js';
  },
  'angular-route': function(file, version) {
    version = version.replace(/[^0-9\.\-]/g, '');
    return '//cdn.jsdelivr.net/angularjs/' + version + '/angular-route.min.js';
  },
  'font-awesome': function(file, version) {
    version = version.replace(/[^0-9\.\-]/g, '');
    var filePath = file.path.split('/').slice(1).join('/');
    return '//cdn.jsdelivr.net/fontawesome/' + version + '/' + filePath;
  },
  'highlightjs': function(file, version) {
    version = version.replace(/[^0-9\.\-]/g, '');
    var filePath = file.path.split('/').slice(1).join('/');
    if(filePath === 'highlight.pack.js') filePath = 'highlight.min.js';
    else if(filePath === 'styles/default.css') filePath = 'styles/default.min.css';
    return '//cdn.jsdelivr.net/highlight.js/' + version + '/' + filePath;
  },
  'bootstrap': function(file, version) {
    version = version.replace(/[^0-9\.\-]/g, '');
    var filePath = file.path.split('/').slice(2).join('/');
    if(filePath === 'css/bootstrap.css') filePath = 'css/bootstrap.min.css';
    return '//cdn.jsdelivr.net/bootstrap/' + version + '/' + filePath;
  }
};
