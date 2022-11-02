const { unlink } = require('fs/promises')
const csvtojson = require('csvtojson')
const ProcessDataStream = require('./process-data-stream/process-data-stream')
const { generateFile } = require('./utils/generateFile')
const { formatBytes } = require('./utils/formatBytes')
const { AWSProvider } = require('./cloud-provider/aws-provider')

const processDataStream = new ProcessDataStream()
const { s3 } = AWSProvider.getInstanceSdk()
const awsProvider = new AWSProvider({ s3 })

async function main() {
  
  const optsGetObject = process.env.SURVEY_FILE

  
  const fileStream = awsProvider.getObjectBucketS3(optsGetObject,true)
  
  await processDataStream.pipefyStream(
    fileStream,
    csvtojson(),
    processDataStream.mapStream(),
    processDataStream.processDataStream()  
  )

  const { filename } = await generateFile(
    processDataStream.finalData,
    processDataStream.salaryTypes
  )

  const optsPutObject = {
   Key: filename,
   Bucket: `${optsGetObject.Bucket}/reports`
  }
  
  await awsProvider.putObjectBucktS3(filename, optsPutObject)
  await unlink(filename)
  
  console.log("Formated Data Bytes", formatBytes(processDataStream.countBytes))
 
}

main()

