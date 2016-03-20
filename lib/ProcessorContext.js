var log4js = require('log4js')
var jsonValidation = require('json-validation')
var moment = require('moment')
var credentialsSchema = require('./credentialsSchema.json')

/**
 * The context passing through the processors
 * @constructor

 * @param {string} name - The process name. This should be unique and with no special characters as it is used for the temp folder to hold the achive files.
 * @param {object} credentials - The dropbox credentials
 * @param {string} credentials.key - The dropbox application key
 * @param {string} credentials.secret - The dropbox application secret
 * @param {string} credentials.token - The dropbox application token
 * @param {ProcessorContext~callback} [cb] - The onComplete callback function

 * @property {string} name - The process name. This should be unique and with no special characters as it is used for the temp folder to hold the achive files
 * @property {date} date - The date created, used in many cases for the archive name
 * @property {object} credentials - The dropbox credentials
 * @property {string} credentials.key - The dropbox application key
 * @property {string} credentials.secret - The dropbox application secret
 * @property {string} credentials.token - The dropbox application token
 * @property {ProcessorContext~callback} [callback] - The onComplete callback function
 */
var ProcessorContext = function (name, credentials, callback) {
  /**
  * @callback ProcessorContext~callback
  * @param {Error} err - The error occured
  */

  var validator = new jsonValidation.JSONValidation()
  var validationResults = validator.validate(credentials, credentialsSchema)

  if (!validationResults.ok) {
    throw new Error(validationResults.errors.join(', ') + ' at path ' + validationResults.path)
  }

  this.name = name
  this.date = moment(new Date())
  this.credentials = credentials
  this.callback = callback
}

/**
 * Log a message to console

 * @param {string} message - The message
 */
ProcessorContext.prototype.log = function (message) {
  var logger = log4js.getLogger('dropbox-backup')
  logger.info(message)
}

/**
 * Log an error to console

 * @param {string} err - The error
 */
ProcessorContext.prototype.error = function (err) {
  var logger = log4js.getLogger('dropbox-backup')
  logger.error(err)
}

module.exports = ProcessorContext
