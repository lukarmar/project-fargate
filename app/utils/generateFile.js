const XLSXChart = require("xlsx-chart");
const { promisify } = require('util')

const chartXlsx = new XLSXChart()

const writeFileAsync = promisify(chartXlsx.writeFile.bind(chartXlsx))

const generateFile = async (finalData, salaryTypes) => {

  const id = new Date().getTime()

  const opts = {
    file: `chart-${id}.xlsx`,
    chart: "column",
    titles: [...new Set(finalData.titles)],
    fields: [...new Set(finalData.fields)],
    data: salaryTypes
  }

  await writeFileAsync(opts)

  return { filename: opts.file }

}

module.exports = { generateFile }