/* eslint-disable */
import { handleStoreHydration } from './utils'
import orm from './models'

require('es6-promise').polyfill()
require('isomorphic-fetch')

const plugin = function ({ nuxtState, beforeNuxtRender, store }, inject) {
  if (store.state.auth && store.state.auth.loggedIn) {
    orm.<%= options.parentModel %>.jwt = store.state.auth['<%= options.authTokenKey %>']
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
  inject('orm', orm)
}
export default plugin
