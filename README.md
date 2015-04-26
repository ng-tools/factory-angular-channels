# factory-angular-channels [![Build Status](https://travis-ci.org/ng-tools/factory-angular-channels.svg?branch=master)](https://travis-ci.org/ng-tools/factory-angular-channels)

> Reusable transform stream channels for your daily AngularJS workflow

## Getting Started

This plugin requires [ngFactory]() `^0.6`

```shell
npm install factory-angular-channels --save-dev
```

## Usage

```javascript
var gulp = require('gulp');
var merge = require('merge-stream');

var config = {
  src: {
    cwd: 'app',
    dest: 'dist',
    tmp: '.tmp',
    index: 'index.{html,jade}',
    views: '{,modules/*/}views/**/*.{html,jade}'
  }
};

var reload = require('browser-sync').reload;
var channels = require('factory-angular-channels');

var src = config.src;
gulp.task('src/views', function() {
  var views = gulp.src(src.views, {cwd: src.cwd, base: src.cwd})
    .pipe(channels.views.src.bind(config)())
    .pipe(reload({stream: true}));
  var index = gulp.src(src.index, {cwd: src.cwd, base: src.cwd})
    .pipe(channels.index.src.bind(config)())
    .pipe(reload({stream: true}));
  return merge(views, index);
});
```


## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style.
Please submit all pull requests the against master branch. If your unit test contains javascript patches or features, you should include relevant unit tests. Thanks!


## Authors

**Olivier Louvignes**

+ http://olouv.com
+ http://github.com/ng-tools


## Copyright and license

    The MIT License

    Copyright (c) 2014 Olivier Louvignes

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    THE SOFTWARE.
