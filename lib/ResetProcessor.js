var fs = require('fs-extra')
var DropboxProcessor = require('./DropboxProcessor.js')

/**
 * Cleans the temporary folder for the backup process
 * @constructor
 * @extends DropboxProcessor
 */
var ResetProcessor = function () {
  DropboxProcessor.apply(this, arguments)
}
ResetProcessor.prototype = Object.create(DropboxProcessor.prototype)

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
