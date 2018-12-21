const pkg = require('./package')
module.exports = {
  mode: 'universal',

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ]
  },

  port: 3030,

  serverMiddleware: [
    { path: '/api', handler: '~/api/index.js' }
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/axios',
    'nuxt-jsorm',
    '@nuxtjs/auth'
  ],

  axios: {
    baseUrl: 'http://localhost:3030/api'
  },

  auth: {
    strategies: {
      local: {
        endpoints: {
          login: {
            url: 'http://localhost:3030/api/auth',
            method: 'get',
            propertyName: 'access_token'
          },
          logout: false,
          user: false
        }
      }
    },
    redirect: {
      login: '/login',
      logout: '/login',
      home: '/'
    },
    token: {
      prefix: 'token.'
    },
    store: true
  },

  build: {
    watch: ['models/*', 'plugins/*', 'store/*', 'api/*']
  }

}
