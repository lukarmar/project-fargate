
const formatBytes = (bytes, decimals = 2) => {
  if(bytes === 0) return "0 Bytes"

  const key = 1024
  const decimalsValue = decimals < 0 ? 0 : decimals
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB"]

  const unities = Math.floor(Math.log(bytes) / Math.log(key))

  return parseFloat((bytes / Math.pow(key, unities)).toFixed(decimalsValue)) + " " + sizes[unities]

}

module.exports = { formatBytes }