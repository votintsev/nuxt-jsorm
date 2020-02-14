/* eslint-disable */
import utils from './utils'
import models from './models'
require('es6-promise').polyfill()
require('isomorphic-fetch')

const plugin = function ({ nuxtState, beforeNuxtRender, store }, inject) {
  const orm = { models, utils }
  if (store && store.state && store.state.auth && store.state.auth.loggedIn) {
    orm.models.<%= options.parentModel %>.jwt = store.state.auth['<%= options.authTokenKey %>']
  }

  inject('orm', orm)

  <% if (options.enableVuexHydration) { %>
    if (process.server) {
      beforeNuxtRender(function() {
        utils.handleStoreHydration(store.state, 'serialize')
      })
    } else if (process.client) {
      let clonedState = JSON.parse(JSON.stringify(nuxtState.state))
      let editedModules = utils.handleStoreHydration(clonedState, 'deserialize')
      for (const vuexModule in nuxtState.state) {
        if(!editedModules.includes(vuexModule)) {
          clonedState[vuexModule] = nuxtState.state[vuexModule]
        }
      }
      store.replaceState(clonedState)
    }
  <% } %>
}

export default plugin
