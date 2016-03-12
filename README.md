# dropbox-backup
> a backup utility for dropbox applications.

[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coveralls Status][coveralls-image]][coveralls-url]

## Overview

This small utility is built to be used as a cron job for daily use.
If so, it would keep the last 3 daily/weekly/monthly backups on structured folders.

Also, you may speficy a custom name, to run a backup on demand, 
resulting with the output file in the root of the dropbox application.

## Install

Install with [npm](https://www.npmjs.com/)

```sh
$ npm install dropbox-backup --save
```

### Usage

```js
var DropboxBackup = require('dropbox-backup');

var backup = new DropboxBackup({
    key: "DROPBOXKEY",
    secret: "DROPBOXSECRET",
    token: "DROPBOXTOKEN"
});

var backupFn = function (x) {

    //=> add a directory to the archive
    x.archive.directory('./lib', 'lib');

    //=> add a file to the archive
    x.archive.file('file.txt');

    //=> upload the archive to dropbox. 
    //=> this takes an optional callback function
    x.upload(function (err) {
        if (err)
            throw err;
        else
            console.log('completed');
    });
}

// upload the backup to the daily/weekly/monthly folders
backup.run(backupFn);
// or upload a single backup as test.js 
backup.run('test', backupFn);

```


## license

    The MIT License (MIT)

    Copyright (c) 2015 akon

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
