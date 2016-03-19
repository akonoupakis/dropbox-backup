/* global describe,it */

var credentials = {
  key: 'mm1zkbloqpjxbm2',
  secret: '1cdf8dvc183zjgj',
  token: 'xqD3RsliawoAAAAAAAAAVe9N0XrXsYy8cdjfN4vqaclj8TU9GPwBq3GhK9Go0bBx'
}

describe('Backup', function () {
  it('backup on schedule', function (done) {
    this.timeout(100000)

    var DropboxBackup = require('../lib/DropboxBackup.js')

    var backup = new DropboxBackup(credentials)

    var fn = function (x) {
      x.archive.directory('./lib', 'target/lib')
      x.archive.file('./test/test.js', {
        name: 'target/test.js'
      })

      x.upload(function (err) {
        if (err) {
          throw err
        }

        done()
      })
    }

    backup.run(fn)
  })

  it('backup on demand', function (done) {
    this.timeout(100000)

    var DropboxBackup = require('../lib/DropboxBackup.js')

    var backup = new DropboxBackup(credentials)

    var fn = function (x) {
      x.archive.directory('./lib', 'target/lib')
      x.archive.file('./test/test.js', {
        name: 'target/test.js'
      })

      x.upload(function (err) {
        if (err) {
          throw err
        }

        done()
      })
    }

    backup.run('custom-backup', fn)
  })
})

