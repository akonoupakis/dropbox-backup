/**
 * The archive processor interface
 * @constructor
 */
var ArchiveProcessor = function () {

}

/**
 * Processes the archive

 * @param {ProcessorContext} context - The processor context
 * @property {object} archive - The zip archive (see {@link https://www.npmjs.com/package/archiver})
 * @property {ArchiveProcessor~callback} cb - The callback function
 */
ArchiveProcessor.prototype.process = function (context, archive, cb) {
  /**
  * @callback ArchiveProcessor~callback
  * @param {Error} err - The error occured
  */
}

module.exports = ArchiveProcessor
