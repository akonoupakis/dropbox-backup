/**
 * The processor base interface
 * @constructor
 */
var BackupProcessor = function () {

}

/**
 * Process the processor procedure

 * @param {ProcessorContext} context - The processor context
 * @param {BackupProcessor~callback} cb - The callback function
 */
BackupProcessor.prototype.process = function (context, cb) {
  /**
  * @callback BackupProcessor~callback
  * @param {Error} err - The error occured
  */

  throw new Error('not implemented')
}

module.exports = BackupProcessor
