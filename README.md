# dropbox-backup
> a backup utility for dropbox applications

![VERSION](https://img.shields.io/npm/v/dropbox-backup.svg)
![DOWNLOADS](https://img.shields.io/npm/dt/dropbox-backup.svg)
[![ISSUES](https://img.shields.io/github/issues-raw/akonoupakis/dropbox-backup.svg)](https://github.com/akonoupakis/dropbox-backup/issues)
![LICENCE](https://img.shields.io/npm/l/dropbox-backup.svg)

[![BUILD](https://api.travis-ci.org/akonoupakis/dropbox-backup.svg?branch=master)](http://travis-ci.org/akonoupakis/dropbox-backup)
![STANDARDJS](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)
[![DEPENDENCIES](https://david-dm.org/akonoupakis/dropbox-backup.svg)](https://david-dm.org/akonoupakis/dropbox-backup)

[![NPM](https://nodei.co/npm/dropbox-backup.png?downloads=true)](https://nodei.co/npm/dropbox-backup/)

## overview

This small utility is built to be used as a cron job for daily use.
If so, it would keep the last 3 daily/weekly/monthly backups on structured folders.

Also, you may speficy a custom name, to run a backup on demand, 
resulting with the output file in the root of the dropbox application.

## usage

```js
var DropboxBackup = require('dropbox-backup');

var backup = new DropboxBackup({
    key: "DROPBOXKEY",
    secret: "DROPBOXSECRET",
    token: "DROPBOXTOKEN"
});

var backupFn = function (x) {

    // add a directory to the archive
    x.archive.directory('./lib', 'lib');

    // add a file to the archive
    x.archive.file('file.txt');

    // upload the archive to dropbox. 
    // this takes an optional callback function
    x.upload(function (err) {
        if (err)
            throw err;
        else
            console.log('completed');
    });
}

// upload the backup to the daily/weekly/monthly folders
backup.run(backupFn);
// or upload a single backup as test.zip 
backup.run('test', backupFn);

```

## copyright and license

Code and documentation copyright 2015 akon. Code released under [the MIT license](https://cdn.rawgit.com/akonoupakis/drobox-backup/master/LICENSE).