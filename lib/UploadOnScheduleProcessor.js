var fs = require('fs-extra')
var path = require('path')
var moment = require('moment')
var Dropbox = require('dropbox')
var DropboxProcessor = require('./DropboxProcessor.js')
var _ = require('underscore')

/**
 * Uploads the archive in daily/weekly/monthly folders keeping the last 3 uploads in each one
 * @constructor
 * @extends DropboxProcessor
 */
var UploadOnScheduleProcessor = function () {
  DropboxProcessor.apply(this, arguments)
}
UploadOnScheduleProcessor.prototype = Object.create(DropboxProcessor.prototype)

UploadOnScheduleProcessor.prototype.process = function (context, cb) {
  var client = new Dropbox.Client({
    key: context.credentials.key,
    secret: context.credentials.secret,
    token: context.credentials.token,
    sandbox: false
  })

  var proceedUpload = function (name, dayCount, nextInternal) {
    client.readdir('/' + name, {}, function (error, results) {
      if (error) {
        context.error(error)
      } else {
        var filteredResults = _.sortBy(results, function (x) { return x })

        var lastUpload = _.last(filteredResults)

        var lastUploadedDate = lastUpload ? moment(path.basename(lastUpload, '.zip'), 'YYYYMMDDHHmmss') : undefined

        if (lastUploadedDate === undefined || context.date.diff(lastUploadedDate, 'days', true) > dayCount) {
          context.log('uploading ' + '"/' + name + '/' + context.date.format('YYYYMMDDHHmmss') + '.zip"')
          fs.readFile('./temp/' + context.name + '/' + context.date.format('YYYYMMDDHHmmss') + '.zip', function (err, fileData) {
            if (err) {
              context.error(err)
            } else {
              client.writeFile('/' + name + '/' + context.date.format('YYYYMMDDHHmmss') + '.zip', fileData, function (err, data) {
                if (err) {
                  context.error(err)
                } else {
                  var obsoleteUploads = []

                  filteredResults.reverse()
                  _.each(filteredResults, function (r, i) {
                    if (i >= 2) {
                      obsoleteUploads.push(r)
                    }
                  })

                  var nextProcess = function () {
                    var firstResultName = obsoleteUploads.shift()
                    if (firstResultName) {
                      client.delete('/' + name + '/' + firstResultName, function (err, data) {
                        if (err) {
                          context.error(err)
                        } else {
                          nextProcess()
                        }
                      })
                    } else {
                      nextInternal()
                    }
                  }

                  nextProcess()
                }
              })
            }
          })
        } else {
          context.log('skipped ' + '"/' + name + '/' + context.date.format('YYYYMMDDHHmmss') + '.zip"')
          nextInternal()
        }
      }
    })
  }

  var processBackup = function (name, dayCount, nextInternal) {
    client.readdir('/' + name, {}, function (error, results) {
      if (error) {
        if (error.status === 404) {
          client.mkdir('/' + name, function (error, results) {
            if (error) {
              context.error(error)
            } else {
              proceedUpload(name, dayCount, nextInternal)
            }
          })
        } else {
          context.error(error)
        }
      } else {
        proceedUpload(name, dayCount, nextInternal)
      }
    })
  }

  processBackup('daily', 0.9, function () {
    processBackup('weekly', 7, function () {
      processBackup('monthly', 30, function () {
        cb()
      })
    })
  })
}

module.exports = UploadOnScheduleProcessor
