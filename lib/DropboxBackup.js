var jsonValidation = require('json-validation')
var credentialsSchema = require('./credentialsSchema.json')
var ProcessorContext = require('./ProcessorContext.js')
var ResetProcessor = require('./ResetProcessor.js')
var TemporaryFolderProcessor = require('./TemporaryFolderProcessor.js')
var UploadOnDemandProcessor = require('./UploadOnDemandProcessor.js')
var UploadOnScheduleProcessor = require('./UploadOnScheduleProcessor.js')
var ZipArchiveProcessor = require('./ZipArchiveProcessor.js')
var _ = require('underscore')

/**
 * The DropboxBackup class
 * @constructor

 * @param {object} options - The dropbox credentials
 * @param {string} options.key - The dropbox application key
 * @param {string} options.secret - The dropbox application secret
 * @param {string} options.token - The dropbox application token

 * @property {object} options - The dropbox credentials
 * @property {string} options.key - The dropbox application key
 * @property {string} options.secret - The dropbox application secret
 * @property {string} options.token - The dropbox application token
 */
var DropboxBackup = function (options) {
  var jv = new jsonValidation.JSONValidation()
  var validationResults = jv.validate(options, credentialsSchema)

  if (!validationResults.ok) {
    throw new Error(validationResults.errors.join(', ') + ' at path ' + validationResults.path)
  }

  this.options = options
  this.processors = []
}

/**
 * Inject an archive processor

 * @param {ArchiveProcessor} processor - The archive processor
 */
DropboxBackup.prototype.use = function (processor) {
  this.processors.push(processor)
}

/**
 * Performs the operation

 * @param {string|function} name - The file name of the backup or the archive function
 * @param {function} fn - The archive function if name is specified
 */
DropboxBackup.prototype.run = function (name, fn) {
  var self = this

  var nameInternal = typeof (name) === 'string' ? name : undefined
  var fnInternal = typeof (fn) === 'function' ? fn : name

  if (typeof (fnInternal) !== 'function') {
    throw new Error('an archive function is required')
  }

  var context = new ProcessorContext(self.options.key, self.options)

  var processors = []
  processors.push({
    process: function (ctx, next) {
      ctx.log('backup started')
      next()
    }
  })
  processors.push(new TemporaryFolderProcessor())
  processors.push(new ZipArchiveProcessor(this.processors, fnInternal))
  if (nameInternal) {
    processors.push(new UploadOnDemandProcessor(nameInternal))
  } else {
    processors.push(new UploadOnScheduleProcessor())
  }

  processors.push(new ResetProcessor())
  processors.push({
    process: function () {
      if (typeof (context.callback) === 'function') {
        context.callback()
      } else {
        context.log('backup completed')
      }
    }
  })

  var nextIndex = 0
  var next = function (err) {
    if (err) {
      if (typeof (context.callback) === 'function') {
        context.callback(err)
      } else {
        var resetProcessor = new ResetProcessor()
        resetProcessor.process(context, function () {
          context.error(err)
          process.exit(1)
        })
      }
    } else {
      nextIndex++
      var processor = processors[nextIndex]
      processor.process(context, next)
    }
  }

  var first = _.first(processors)
  first.process(context, next)
}

module.exports = DropboxBackup
