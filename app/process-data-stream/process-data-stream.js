const { Transform, Writable, pipeline } = require('stream')
const { promisify } = require('util')

const { timeWriteProcessBytes } = require('../utils/timeWriteProcessBytes')
const { formatBytes } = require('../utils/formatBytes')


class ProcessDataStream {

  countBytes;
  
  finalData = {
    fields: [],
    titles: []
  }

  salaryTypes = {}

  constructor(){
    this.countBytes = 0;
    this.pilepineAsync = promisify(pipeline)
  }

  
  mapStream() {
    return new Transform({
      objectMode: true,
      transform: (chunk, encoding, cb) => {
        this.countBytes += chunk.length

        const item = JSON.parse(chunk)
        const data = JSON.stringify({
          Country: item.Country,
          SalaryType: item.SalaryType,
          Respondent: item.Respondent
        })
        
        return cb(null, data)

      }
    })
    
  }  

  processDataStream(){

    let timeExecute = new Date().getTime()

    return new Writable({
      objectMode: true,
      write: (chunk, encoding, cb) => {
        const item = JSON.parse(chunk);

        if(item.SalaryType === "NA") {
          return cb()
        }

        this.finalData.titles.push(item.SalaryType)
        this.finalData.fields.push(item.Country)


        if(!this.salaryTypes[item.SalaryType]) {
          this.salaryTypes[item.SalaryType] = {}
        }

        if(!this.salaryTypes[item.SalaryType][item.Country]) {
          this.salaryTypes[item.SalaryType][item.Country] = 1
        }

        this.salaryTypes[item.SalaryType][item.Country] += 1


        if(!timeWriteProcessBytes(timeExecute)) {
          timeExecute = new Date().getTime()
          return cb()
        }

        console.log(formatBytes(this.countBytes))
        timeExecute = new Date().getTime()
        return cb()

      }
    })

  }

  async pipefyStream(...args) {
    return await this.pilepineAsync(
      ...args
    )
  }

}

module.exports = ProcessDataStream