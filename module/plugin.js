/* eslint-disable */
import utils from './utils'
import models from './models'
import Vue from 'vue'
import { MiddlewareStack } from 'spraypaint'
require('es6-promise').polyfill()
require('isomorphic-fetch')

const plugin = function ( nuxtContext, inject ) {
  const { nuxtState, beforeNuxtRender, store } = nuxtContext
  const orm = { models, utils }
  if (store && store.state && store.state.auth && store.state.auth.loggedIn) {
    orm.models.<%= options.parentModel %>.jwt = store.state.auth['<%= options.authTokenKey %>']
  }
  <% if ((options.middleware && options.middleware.afterFilters && options.middleware.afterFilters.length) || (options.middleware && options.middleware.beforeFilters && options.middleware.beforeFilters.length)) { %>
  const middlewareStack = new MiddlewareStack()
  let middlewareConfigured = false
    <% for ( const item in options.middleware ) {
      if ( Object.prototype.hasOwnProperty.call( options.middleware, item ) ) {
        if ( options.middleware[item] && options.middleware[item].length && Array.isArray( options.middleware[item] ) ) {
          for ( const key in options.middleware[item] ) { %>
  middlewareConfigured = true
              <% if ( typeof options.middleware[item][key] === 'function' ) { %>
  const middlewareItem<%= item.charAt(0).toUpperCase() + item.slice(1) + key %> = <%= options.middleware[item][key] %>
  middlewareStack.<%= item %>.push( middlewareItem<%= item.charAt(0).toUpperCase() + item.slice(1) + key %>(nuxtContext) )
            <% }
          }
        }
      }
    } %>
  if ( middlewareConfigured ) {
    orm.models.<%= options.parentModel %>.middlewareStack = middlewareStack
  }
  <% } %>

  nuxtContext.$orm = orm
  inject('orm', orm)
  Vue.prototype.$porm = orm

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
