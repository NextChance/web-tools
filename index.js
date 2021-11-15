const fs = require('fs-extra')

const copyFile = (origin, destination) => {
  fs.copy(origin, destination, function (err) {
    if (err) {
      console.error(`An error occured while copying ${origin}.`)
      return console.error(err)
    }
    console.log(`Copy ${origin} completed!`)
  })
}

const initWatchers = ({ source, destination, label }) => {
  console.log(`Watching files on ${label}`)
  fs.watch(source, { recursive: true }, async (eventType, filename) => {
    if (eventType !== 'rename' && filename[filename.length - 1] !== '~') {
      console.log(`${filename}: [${eventType}]`)
      try {
        await fs.unlink(`${destination}${filename}`)
      } catch (e) {
        console.log(`error on pre-deleting existing file ${destination}${filename}`)
      }
      copyFile(`${source}${filename}`, `${destination}${filename}`)
    }
  })
}

const pruneDirectory = async (folder) => {
  console.log(`Prune Directory: ${folder}`)
  try {
    await fs.promises.rmdir(folder, { recursive: true })
  } catch (e) {
    console.log(`Error occurred pruning ${folder}`)
  }
}

exports.pruneAndCopyAllFilesOnce = (config) => {
  process.env.NC43_DEPENDENCY_CONFIG = JSON.stringify(config)
  config.forEach((config) => {
    pruneDirectory(config.destination).then(() => {
      copyFile(config.source, config.destination)
    })
  })
}

exports.watchFiles = (config) => {
  if (config) {
    config.forEach((config) => {
      initWatchers(config)
    })
  } else {
    console.log('-----> ', 'Config not found')
  }
}
