const path = require('path')
const puppeteer = require('puppeteer')
const { transferData } = require('./utils')

const PORT = 3030
const BASE_URL = `http://localhost:${PORT}`

const initNuxt = async () => {
  const { Nuxt, Builder } = require('nuxt')
  const cwd = process.cwd()
  const nuxtDir = path.resolve(cwd, 'example')
  let config = {}
  try {
    config = require(path.resolve(nuxtDir, 'nuxt.config.js'))
  } catch (e) {
    throw Error("Couldn't find nuxt.config.js.")
  }
  if (config.build && config.build.analyze) {
    delete config.build.analyze
  }
  config.rootDir = nuxtDir
  config.dev = false
  const nuxt = new Nuxt(config)
  await new Builder(nuxt).build()
  await nuxt.listen(PORT, 'localhost')
  return nuxt
}

module.exports = async function () {
  if (!process.env.SELF_START) {
    const nuxt = await initNuxt()
    global.__NUXT__ = nuxt
  }

  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
  global.__BROWSER__ = browser

  transferData({
    BASE_URL: process.env.SELF_START ? null : BASE_URL,
    wsEndpoint: browser.wsEndpoint()
  })
}
