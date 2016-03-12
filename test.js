var DropboxBackup = require('./index.js');

var backup = new DropboxBackup({
    key: 'f9bnbl6mewf9esz',
    secret: '903y0mzripb7epq',
    token: 'xqD3RsliawoAAAAAAAAASSv1BF3dCrOMG_H0jVNEIe8r8KZgILicIJynejAi9l0z'
});

var fn = function (x) {

    x.archive.file('index.js');

    x.upload();
};

//backup.run('custom-backup', fn);
backup.run(fn);