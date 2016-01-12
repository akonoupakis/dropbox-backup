# dropbox-backup

> A backup utility for dropbox applications.

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

backup.run('test', function (x) {

    //=> add a directory to the archive
    x.archive.directory('./lib', 'lib');

    //=> add a file to the archive
    x.archive.file('./file.txt', 'file.txt');

    x.upload(function (err) {
        if (err)
            throw err;
        else
            console.log('completed');
    });
});
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
