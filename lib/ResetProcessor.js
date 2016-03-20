var fs = require('fs-extra')
var BackupProcessor = require('./BackupProcessor.js')

/**
 * Cleans the temporary folder for the backup process
 * @constructor
 * @extends BackupProcessor
 */
var ResetProcessor = function () {
  BackupProcessor.apply(this, arguments)
}
ResetProcessor.prototype = Object.create(BackupProcessor.prototype)

ResetProcessor.prototype.process = function (context, cb) {
  context.log('removing temporary files...')
  fs.remove('./temp/' + context.name, function (err) {
    if (err) {
      context.error(err)
    } else {
      cb()
    }
  })
}

module.exports = ResetProcessor
