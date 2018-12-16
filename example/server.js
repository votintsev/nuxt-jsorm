/* eslint-disable no-console */
const path = require('path')
const fs = require('fs')
const glob = require('glob')
const express = require('express')
const app = express()

const ip = '127.0.0.1'
const port = 3030
const applicationRoot = __dirname.replace(/\\/g, '/')
const mockRoot = applicationRoot + '/api'
const mockFilePattern = '.json'
const mockRootPattern = mockRoot + '/**/*' + mockFilePattern
const apiRoot = '/api'

/* Read the directory tree according to the pattern specified above. */
// const files = glob.sync(mockRootPattern)

// /* Register mappings for each file found in the directory tree. */
// if (files && files.length > 0) {
//   files.forEach(function (fileName) {
//     const mapping = apiRoot + fileName.replace(mockRoot, '').replace(mockFilePattern, '')

//     app.get(mapping, function (req, res) {
//       const data = fs.readFileSync(fileName, 'utf8')
//       res.writeHead(200, { 'Content-Type': 'application/vnd.api+json' })
//       res.write(data)
//       res.end()
//     })

//     console.log('Registered mapping: %s -> %s', mapping, fileName)
//   })
// } else {
//   console.log('No mappings found! Please check the configuration.')
// }

/* eslint no-param-reassign: 0, max-len: 0 */

const { Nuxt, Builder } = require('nuxt')
const nuxtConfig = require('./nuxt.config')

const config = {
  dev: false,
  port,
  ...nuxtConfig
}
if (config.build && config.build.analyze) {
  delete config.build.analyze
}
config.dev = false
const nuxt = new Nuxt(config)
new Builder(nuxt).build().then(() => {
  app.use(nuxt.render)

  /* Start the API mock server. */
  console.log('Application root directory: [' + applicationRoot + ']')
  console.log('Mock Api Server listening: [http://' + ip + ':' + port + ']')
  app.listen(port, ip)
})
