var fs = require('fs-extra')
var Dropbox = require('dropbox')
var DropboxProcessor = require('./DropboxProcessor.js')

/**
 * Uploads on demane a single zip file with a specific file.
 * @constructor
 * @extends DropboxProcessor

 * @param {string} name - The name of the zip file to be created

 * @property {string} name - The name of the zip file to be created
 */
var UploadOnDemandProcessor = function (name) {
  DropboxProcessor.apply(this, arguments)

  this.name = name
}
UploadOnDemandProcessor.prototype = Object.create(DropboxProcessor.prototype)

UploadOnDemandProcessor.prototype.process = function (context, cb) {
  var self = this

  var client = new Dropbox.Client({
    key: context.credentials.key,
    secret: context.credentials.secret,
    token: context.credentials.token,
    sandbox: false
  })

  context.log('uploading ' + '"/' + self.name + '.zip"')
  fs.readFile('./temp/' + context.credentials.key + '/' + context.date.format('YYYYMMDDHHmmss') + '.zip', function (err, fileData) {
    if (err) {
      context.error(err)
    } else {
      client.writeFile('/' + self.name + '.zip', fileData, { binary: true }, function (err, data) {
        if (err) {
          context.error(err)
        } else {
          cb()
        }
      })
    }
  })
}

module.exports = UploadOnDemandProcessor
