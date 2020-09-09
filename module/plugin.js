/* eslint-disable */
import utils from './utils'
import models from './models'
import { MiddlewareStack } from 'spraypaint'
require('es6-promise').polyfill()
require('isomorphic-fetch')

const plugin = function ( nuxtContext, inject ) {
  const { nuxtState, beforeNuxtRender, store } = nuxtContext
  const orm = { models, utils }
  const middleware = <%= options.middleware %>
  if (store && store.state && store.state.auth && store.state.auth.loggedIn) {
    orm.models.<%= options.parentModel %>.jwt = store.state.auth['<%= options.authTokenKey %>']
  }

  if ((middleware && middleware.afterFilters && middleware.afterFilters.length) || (middleware && middleware.beforeFilters && middleware.beforeFilters.length)) {
    const middlewareStack = new MiddlewareStack()
    let middlewareConfigured = false
    for ( const item in middleware ) {
      if ( Object.prototype.hasOwnProperty.call( middleware, item ) ) {
        if ( middleware[item] && middleware[item].length && Array.isArray( middleware[item] ) ) {
          middleware[item].forEach( function ( key ) {
            middlewareConfigured = true
            if ( typeof middleware[item][key] === 'function' ) {
              middlewareStack[item].push( middleware[item][key](nuxtContext) )
            }
          } )
        }
      }
    }
    if ( middlewareConfigured ) {
      orm.models.<%= options.parentModel %>.middlewareStack = middlewareStack
    }
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
