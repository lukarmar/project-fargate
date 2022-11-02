const timeWriteProcessBytes = (lastTimerun, timeDelay = 3) => {
  return (new Date().getTime() - lastTimerun) > timeDelay
}

module.exports = { timeWriteProcessBytes }