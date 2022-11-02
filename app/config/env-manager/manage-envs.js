const AWS = require('aws-sdk')
const { ssmPrefix, variables } = require('./env')

const SSM = new AWS.SSM({
  region: variables.REGION.value
})

const sleep = ms => new Promise(r => setTimeout(r, ms))

;
(async () => {
  const promises = []

  for(const [key, data] of Object.entries(variables)){ 
    const { type, value } = data

    if(!value) continue

    const result = SSM.putParameter({
      Overwrite: true,
      Name: `${ssmPrefix}/${key}`,
      Type: type,
      Value: value
    }).promise()

    promises.push(result)

    await sleep(500)
  }

  await Promise.all(promises)
  
})()
