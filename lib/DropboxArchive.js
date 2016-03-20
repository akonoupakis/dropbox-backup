var fs = require('fs-extra')
var archiver = require('archiver')

/**
 * Exposes the archive functionality
 * @constructor

 * @param {ProcessorContext} context - The context
 * @param {DropboxArchive~callback} cb - The callback function

 * @property {ProcessorContext} context - The context
 * @property {object} object - The zip archive (see {@link https://www.npmjs.com/package/archiver})
 * @property {DropboxArchive~callback} cb - The callback function
 */
var DropboxArchive = function (context, cb) {
  /**
  * @callback DropboxArchive~callback
  * @param {Error} err - The error occured
  */

  this.context = context
  this.archive = archiver.create('zip', {})
  this.callback = cb
}

/**
 * Upload the archive to the dropbox application

 * @property {DropboxArchive~callback} cb - The callback function
 */
DropboxArchive.prototype.upload = function (cb) {
  /**
  * @callback DropboxArchive~uploadCallback
  * @param {Error} err - The error occured
  */

  var self = this

  this.context.callback = cb

  var output = fs.createWriteStream('./temp/' + this.context.credentials.key + '/' + this.context.date.format('YYYYMMDDHHmmss') + '.zip')

  output.on('close', function () {
    self.callback()
  })

  output.on('error', function (err) {
    cb(err)
  })

  this.archive.pipe(output)
  this.archive.finalize()
}

module.exports = DropboxArchive
