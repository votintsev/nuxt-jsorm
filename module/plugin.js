/* eslint-disable */
import Vue from 'vue'
import { JSORMVue } from 'jsorm-vue'
import { handleStoreHydration } from './utils'
import orm from './models'
require('es6-promise').polyfill()
require('isomorphic-fetch')

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
    for (const vuexModule in nuxtState.state) {
      if(!editedModules.includes(vuexModule)) {
        clonedState[vuexModule] = nuxtState.state[vuexModule]
      }
    }
    store.replaceState(clonedState)
  }
  ctx.$orm = orm
  inject('orm', orm)
}
export default plugin
