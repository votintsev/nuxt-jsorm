/* eslint-disable */
import Vue from 'vue'
import { JSORMVue } from 'jsorm-vue'
import { handleStoreHydration } from './utils'
import * as orm from './models'
require('isomorphic-fetch')
var jsorm = require('jsorm')

<%= options.models.map(({ model, path }) => `import Create${model}Model from '${path.replace(/\\/g,'/')}'`).join('\n') %>

Vue.use(JSORMVue)

const plugin = function (ctx, inject) {
  const { app, nuxtState, beforeNuxtRender, store } = ctx
  const loggedIn = app.store.$auth.$state.loggedIn
  const token = app.store.$auth.$state['<%= options.authTokenKey %>']

  orm.<%= options.parentModel %>.jwt = token

  if (process.server) {
    beforeNuxtRender(function() {
      handleStoreHydration(store.state, 'serialize')
    })
  } else if (process.client) {
    let clonedState = JSON.parse(JSON.stringify(nuxtState.state))
    handleStoreHydration(clonedState, 'deserialize')
    store.replaceState(clonedState)
  }
  ctx.$orm = orm
  inject('orm', orm)
}
export default plugin
