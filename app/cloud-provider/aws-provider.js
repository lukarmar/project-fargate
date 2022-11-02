const AWS = require("aws-sdk")
const { readFile } = require('fs/promises')


class AWSProvider {
  constructor({ s3 }) {
    this.s3Provider = s3
  }

  static getInstanceSdk() {

    return {
     s3: new AWS.S3()
    }
  }

  getObjectBucketS3(opts, doWithStream = false) {
    return doWithStream ? 
              this.s3Provider.getObject(opts).createReadStream() : 
              this.s3Provider.getObject(opts)
  }

 
  async putObjectBucktS3(fileName, opts) {
    const fileNameBody = await readFile(fileName)

    await this.s3Provider.putObject({
      ...opts,
      Body: fileNameBody
    }).promise()
  }

}

module.exports = { AWSProvider }