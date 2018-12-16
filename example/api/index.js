/* eslint-disable no-console, prefer-const */
const fs = require('fs')
const glob = require('glob')
// const applicationRoot =
const mockRoot = __dirname.replace(/\\/g, '/')
const mockFilePattern = '.json'
const mockRootPattern = mockRoot + '/**/*' + mockFilePattern
const apiRoot = '/api'
/* Read the directory tree according to the pattern specified above. */
const files = glob.sync(mockRootPattern)

/* Register mappings for each file found in the directory tree. */
let mappings = {}
if (files && files.length > 0) {
  files.forEach(function (fileName) {
    const mapping = fileName.replace(mockRoot, '').replace(mockFilePattern, '')
    mappings[mapping] = fs.readFileSync(fileName, 'utf8')
  })
}

export default function (req, res, next) {
  console.log('Requested /api' + req.url)
  if (!mappings[req.url]) {
    res.statusCode = 404
    res.write('Not Found')
    return res.end()
  }

  res.writeHead(200, { 'Content-Type': 'application/vnd.api+json' })
  res.write(mappings[req.url])
  return res.end()
}
