/**
 * The processor base interface
 * @constructor
 */
var DropboxProcessor = function () {

}

/**
 * Process the processor procedure

 * @param {ProcessorContext} context - The processor context
 * @param {DropboxProcessor~callback} cb - The callback function
 */
DropboxProcessor.prototype.process = function (context, cb) {
  /**
  * @callback DropboxProcessor~callback
  * @param {Error} err - The error occured
  */

  throw new Error('not implemented')
}

module.exports = DropboxProcessor
