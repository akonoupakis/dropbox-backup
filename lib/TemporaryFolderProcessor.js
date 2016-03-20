var fs = require('fs-extra')
var BackupProcessor = require('./BackupProcessor.js')

/**
 * Creates the temporary folder for the backup process
 * @constructor
 * @extends BackupProcessor
 */
var TemporaryFolderProcessor = function () {
  BackupProcessor.apply(this, arguments)
}
TemporaryFolderProcessor.prototype = Object.create(BackupProcessor.prototype)

TemporaryFolderProcessor.prototype.process = function (context, cb) {
  context.log('creating backup folder...')

  fs.emptyDir('./temp/' + context.name, function (err) {
    if (err) {
      context.error(err)
    } else {
      cb()
    }
  })
}

module.exports = TemporaryFolderProcessor
