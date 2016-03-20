/**
 * The archive processor interface

 * @property {object} object - The zip archive (see {@link https://www.npmjs.com/package/archiver})
 * @property {ArchiveProcessorCallback} cb - The callback function
 */
var ArchiveProcessor = function (archive, cb) {
  /**
  * @callback ArchiveProcessorCallback
  * @param {Error} err - The error occured
  */
}

module.exports = ArchiveProcessor
