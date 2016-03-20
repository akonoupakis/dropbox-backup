var DropboxProcessor = require('./DropboxProcessor.js')
var DropboxArchive = require('./DropboxArchive.js')

/**
 * Processes the zip file for uploading
 * @constructor
 * @extends DropboxProcessor

 * @param {function} fn - The user input function with the {DropboxArchive} as an argument
 */
var ZipArchiveProcessor = function (fn) {
  DropboxProcessor.apply(this, arguments)
  this.fn = fn
}
ZipArchiveProcessor.prototype = Object.create(DropboxProcessor.prototype)

ZipArchiveProcessor.prototype.process = function (context, cb) {
  context.log('creating archive file...')

  var archive = new DropboxArchive(context, cb)
  this.fn(archive)
}

module.exports = ZipArchiveProcessor
