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
  if (app.$auth && app.$auth.loggedIn && app.$auth.$state) {
    orm.<%= options.parentModel %>.jwt = app.$auth.$state['<%= options.authTokenKey %>']
  }

  if (process.server) {
    beforeNuxtRender(function() {
      handleStoreHydration(store.state, 'serialize')
    })
  } else if (process.client) {
    let clonedState = JSON.parse(JSON.stringify(nuxtState.state))
    let editedModules = handleStoreHydration(clonedState, 'deserialize')
    for (const module in editedModules) {
      const editedModule = editedModules[module]
      try {
        store.commit(`${editedModule}/replace`, clonedState[editedModule])
      } catch (err) {
        console.error(`[nuxt-jsorm]: no 'replace' mutation on vuex module '${editedModule}'.`)
      }
    }
  }
  ctx.$orm = orm
  inject('orm', orm)
}
export default plugin
