var BackupProcessor = require('./BackupProcessor.js')
var DropboxArchive = require('./DropboxArchive.js')

/**
 * Processes the zip file for uploading
 * @constructor
 * @extends BackupProcessor

 * @param {function} fn - The user input function with the {DropboxArchive} as an argument
 */
var ZipArchiveProcessor = function (fn) {
  BackupProcessor.apply(this, arguments)
  this.fn = fn
}
ZipArchiveProcessor.prototype = Object.create(BackupProcessor.prototype)

ZipArchiveProcessor.prototype.process = function (context, cb) {
  context.log('creating archive file...')

  var archive = new DropboxArchive(context, cb)
  this.fn(archive)
}

module.exports = ZipArchiveProcessor
