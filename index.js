var fs = require('fs-extra');
var path = require('path');
var jsonValidation = require('json-validation');
var Dropbox = require("dropbox");
var archiver = require('archiver');
var moment = require('moment');
var server = require('server-root');
var _ = require('underscore');

var optionsSchema = {
    type: 'object',
    required: true,
    properties: {
        key: {
            type: 'string',
            required: true
        },
        secret: {
            type: 'string',
            required: true
        },
        token: {
            type: 'string',
            required: true
        }
    }
};

var DropboxArchive = function (options, ctx, next) {
    this.options = options;
    this.ctx = ctx;
    this.archive = archiver.create('zip', {});
    this.next = next;
};

DropboxArchive.prototype.upload = function (cb) {
    var self = this;

    this.ctx.cb = cb;

    var output = fs.createWriteStream('./temp/' + this.options.key + '/' + this.ctx.date.format("YYYYMMDDHHmmss") + '.zip');

    output.on('close', function () {
        self.next();
    });

    output.on('error', function (err) {
        cb(err);
    });

    this.archive.pipe(output);
    this.archive.finalize();
};

var FolderProcessor = function () { };
FolderProcessor.prototype.process = function (ctx, next) {
    console.log('creating backup folder...');

    fs.emptyDir('./temp/' + ctx.name, function (err) {
        if (err) {
            ctx.error(ctx, err);
        }
        else {
            next();
        }
    });
};

var ZipProcessor = function (fn) {
    this.fn = fn;
};
ZipProcessor.prototype.process = function (ctx, next) {
    console.log('creating archive file...');

    var archive = new DropboxArchive(ctx.options, ctx, next);
    this.fn(archive);
};

var UploadProcessor = function () { };
UploadProcessor.prototype.process = function (ctx, next) {
    var client = new Dropbox.Client({
        key: ctx.options.key,
        secret: ctx.options.secret,
        token: ctx.options.token,
        sandbox: false
    });

    var proceedUpload = function (name, dayCount, nextInternal) {
        client.readdir('/' + name, {}, function (error, results) {
            if (error) {
                ctx.error(error);
            }
            else {

                var filteredResults = _.sortBy(results, function (x) { return x; });

                var lastUpload = _.last(filteredResults);

                var lastUploadedDate = lastUpload ? moment(path.basename(lastUpload, '.zip'), 'YYYYMMDDHHmmss') : undefined;

                if (lastUploadedDate === undefined || ctx.date.diff(lastUploadedDate, 'days', true) > dayCount) {

                    console.log('uploading ' + '"/' + name + '/' + ctx.date.format('YYYYMMDDHHmmss') + '.zip"');
                    fs.readFile('./temp/' + ctx.name + '/' + ctx.date.format('YYYYMMDDHHmmss') + '.zip', function (err, fileData) {
                        if (err) {
                            ctx.error(err);
                        }
                        else {
                            client.writeFile('/' + name + '/' + ctx.date.format('YYYYMMDDHHmmss') + '.zip', fileData, function (err, data) {
                                if (err) {
                                    ctx.error(err);
                                }
                                else {

                                    var obsoleteUploads = [];

                                    filteredResults.reverse();
                                    _.each(filteredResults, function (r, i) {
                                        if (i >= 2)
                                            obsoleteUploads.push(r);
                                    });

                                    var nextProcess = function () {
                                        var firstResultName = obsoleteUploads.shift();
                                        if (firstResultName) {
                                            client.delete('/' + name + '/' + firstResultName, function (err, data) {
                                                if (err) {
                                                    ctx.error(err);
                                                }
                                                else {
                                                    nextProcess();
                                                }
                                            });
                                        }
                                        else {
                                            nextInternal();
                                        }
                                    };

                                    nextProcess();
                                }
                            });
                        }
                    });

                }
                else {
                    console.log('skipped ' + '"/' + name + '/' + ctx.date.format('YYYYMMDDHHmmss') + '.zip"');
                    nextInternal();
                }

            }
        });
    };

    var processBackup = function (name, dayCount, nextInternal) {
        client.readdir('/' + name, {}, function (error, results) {
            if (error) {
                if (error.status === 404) {
                    client.mkdir('/' + name, function (error, results) {
                        if (error) {
                            ctx.error(error);
                        }
                        else {
                            proceedUpload(name, dayCount, nextInternal);
                        }
                    });
                }
                else {
                    ctx.error(error);
                }
            }
            else {
                proceedUpload(name, dayCount, nextInternal);
            }
        });

    }

    processBackup('daily', 0.9, function () {
        processBackup('weekly', 7, function () {
            processBackup('monthly', 30, function () {
                next();
            });
        });
    });

};

var UploadOnDemandProcessor = function (name) {
    this.name = name;
};
UploadOnDemandProcessor.prototype.process = function (ctx, next) {
    var self = this;

    var client = new Dropbox.Client({
        key: ctx.options.key,
        secret: ctx.options.secret,
        token: ctx.options.token,
        sandbox: false
    });

    console.log('uploading ' + '"/' + self.name + '.zip"');
    fs.readFile('./temp/' + ctx.options.key + '/' + ctx.date.format('YYYYMMDDHHmmss') + '.zip', function (err, fileData) {
        if (err) {
            ctx.error(err);
        }
        else {
            client.writeFile('/' + self.name + '.zip', fileData, { binary: true }, function (err, data) {
                if (err) {
                    ctx.error(err);
                }
                else {
                    next();
                }
            });
        }
    });

};

var ResetProcessor = function () { };
ResetProcessor.prototype.process = function (ctx, next) {
    console.log('removing temporary files...');
    fs.remove('./temp/' + ctx.name, function (err) {
        if (err) {
            ctx.error(ctx, err);
        }
        else {
            next();
        }
    });
};

var ErrorHandler = function () { };
ErrorHandler.prototype.handle = function (ctx, ex) {
    var resetProcessor = new ResetProcessor();
    resetProcessor.process(ctx, function () {
        throw ex;
    });
};

var DropboxBackup = function (options) {
    var jv = new jsonValidation.JSONValidation();
    var validationResults = jv.validate(options, optionsSchema);

    if (!validationResults.ok)
        throw new Error(validationResults.errors.join(", ") + " at path " + validationResults.path);

    this.options = options;

    this.errorHandler = new ErrorHandler();
};

DropboxBackup.prototype.run = function (name, fn) {
    var self = this;

    var nameInternal = typeof (name) === 'string' ? name : undefined;
    var fnInternal = typeof (fn) === 'function' ? fn : name;

    if (typeof (fnInternal) !== 'function')
        throw new Error('an archive fucntion is required');

    var ctx = {};
    ctx.name = self.options.key;
    ctx.options = self.options;
    ctx.date = new moment(new Date());
    ctx.error = function (ex) {
        if (typeof (ctx.cb) === 'function')
            ctx.cb(ex);
        else
            self.errorHandler.handle(ex);
    };

    var processors = [];
    processors.push({
        process: function (ctx, next) {
            console.log('backup started');
            next();
        }
    });
    processors.push(new FolderProcessor());
    processors.push(new ZipProcessor(fnInternal));
    if (nameInternal)
        processors.push(new UploadOnDemandProcessor(nameInternal));
    else
        processors.push(new UploadProcessor());

    processors.push(new ResetProcessor());
    processors.push({
        process: function () {
            if (typeof (ctx.cb) === 'function')
                ctx.cb();
            else
                console.log('backup complete');
        }
    });

    var nextIndex = 0;
    var next = function () {
        nextIndex++;
        var processor = processors[nextIndex];
        processor.process(ctx, next);
    };

    var first = _.first(processors);
    first.process(ctx, next);
};

module.exports = DropboxBackup;