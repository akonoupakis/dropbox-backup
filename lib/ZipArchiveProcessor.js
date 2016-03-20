var BackupProcessor = require('./BackupProcessor.js')
var DropboxArchive = require('./DropboxArchive.js')

/**
 * Processes the zip file for uploading
 * @constructor
 * @extends BackupProcessor

 * @param {ArchiveProcessor[]} processors - The injected processors
 * @param {function} fn - The user input function with the {DropboxArchive} as an argument

 * @property {ArchiveProcessor[]} processors - The injected processors
 * @property {function} fn - The user input function with the {DropboxArchive} as an argument
 */
var ZipArchiveProcessor = function (processors, fn) {
  BackupProcessor.apply(this, arguments)

  this.processors = processors.slice(0)
  this.fn = fn
}
ZipArchiveProcessor.prototype = Object.create(BackupProcessor.prototype)

ZipArchiveProcessor.prototype.process = function (context, cb) {
  var self = this

  context.log('creating archive file...')

  var archive = new DropboxArchive(context, cb)

  var process = function () {
    var processor = self.processors.shift()
    if (processor) {
      processor.process(context, archive.archive, function (err, res) {
        if (err) {
          return cb(err)
        }

        process()
      })
    } else {
      self.fn(archive)
    }
  }

  process()
}

module.exports = ZipArchiveProcessor
