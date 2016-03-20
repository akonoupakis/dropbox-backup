var fs = require('fs-extra')
var DropboxProcessor = require('./DropboxProcessor.js')

/**
 * Creates the temporary folder for the backup process
 * @constructor
 * @extends DropboxProcessor
 */
var TemporaryFolderProcessor = function () {
  DropboxProcessor.apply(this, arguments)
}
TemporaryFolderProcessor.prototype = Object.create(DropboxProcessor.prototype)

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
