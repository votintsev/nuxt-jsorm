/* eslint-disable */
import * as jsorm from 'jsorm'
import Vue from 'vue'
import { JSORMVue } from 'jsorm-vue'
require('isomorphic-fetch')

Vue.use(JSORMVue)

// Active models
<%= options.models.map(({ model, path }) => `import Create${model}Model from '${path.replace(/\\/g,'/')}'`).join('\n') %>

export default function ({ app, nuxtState, beforeNuxtRender, store }, inject) {
  const loggedIn = app.store.$auth.$state.loggedIn
  const token = app.store.$auth.$state['<%= options.authTokenKey %>']
  let config = {}
  if (typeof app.$config !== "undefined") {
    config = (typeof app.$config.client !== "undefined") ? app.$config.client: app.$config
  }
  // Options
  const options = <%= JSON.stringify(options) %>

  let orm = {
    <%= options.parentModel %>: Create<%= options.parentModel %>Model(jsorm.JSORMBase, token, config)
  }

  <%=
  options.models.map(({ model, path, base }) => {
    if(base) return ''
    return `// ${model}\n  orm.${model} = Create${model}Model(orm.${options.parentModel}, jsorm, config)`
  }).join('\n\n  ')
  %>

  const deserializeModel = function({ attributes, relationships, id, isPersisted, isMarkedForDestruction, isMarkedForDisassociation, errors }, model) {
    let retRelationships = {}, attrs

    if(Object.keys(relationships).length > 0) {
      for (const relationship in relationships) {
        if (typeof retRelationships[relationship] === "undefined") {
          retRelationships[relationship] = []
        }

        const relatedItems = relationships[relationship]

        for (const relatedItem in relatedItems) {
          retRelationships[relationship].push(deserializeModel(relatedItems[relatedItem], nuxtState.state[relationship].jsorm))
        }
      }
      attrs = Object.assign({}, attributes, retRelationships)
    } else {
      attrs = Object.assign({}, attributes)
    }

    let ret = new orm[model](attrs)

    ret.id = id
    ret.isPersisted = isPersisted
    ret.isMarkedForDestruction = isMarkedForDestruction
    ret.isMarkedForDisassociation = isMarkedForDisassociation
    ret.errors = Object.assign({}, errors)

    return ret
  }

  const serializeModel = function({ attributes, relationships, id, isPersisted, isMarkedForDestruction, isMarkedForDisassociation, errors }, model) {
    let ret = {
      attributes: Object.assign({}, attributes),
      relationships: {},
      id,
      isPersisted,
      isMarkedForDestruction,
      isMarkedForDisassociation,
      serializedByNuxtJsOrm: true,
      errors: Object.assign({}, errors)
    }
    if(Object.keys(relationships).length < 1) {
      return ret
    }

    for (const relationship in relationships) {
      if (typeof ret.relationships[relationship] === "undefined") {
        ret.relationships[relationship] = []
      }

      const relatedItems = relationships[relationship]

      for (const relatedItem in relatedItems) {
        ret.relationships[relationship].push(serializeModel(relatedItems[relatedItem], model))
      }
    }

    return ret
  }

  const isJSORMObject = function(item) {
    if (typeof item !== "object") {
      return false
    }

    if (typeof item.serializedByNuxtJsOrm !== "undefined") {
      return true
    }

    if (item instanceof orm.Base) {
      return true
    }

    return false
  }

  const handleSerialization = function(state, serializeFunction) {
    for (const storeModule in state) {
      const moduleState = store.state[storeModule]
      if (typeof moduleState.jsorm !== "string") {
        continue
      }
      if (typeof moduleState.by_account !== "undefined") {
        for (const accountId in moduleState.by_account) {
          const accountData = moduleState.by_account[accountId]
          if (typeof accountData[storeModule] === "undefined") continue
          for (const itemId in accountData[storeModule]) {
            if (!isJSORMObject(accountData[storeModule][itemId])) {
              continue
            }
            state[storeModule].by_account[accountId][storeModule][itemId] = serializeFunction(accountData[storeModule][itemId], moduleState.jsorm)
          }
        }
      } else if (typeof moduleState[storeModule] !== "undefined") {
        for (const itemId in moduleState[storeModule]) {
          if (!isJSORMObject(moduleState[storeModule][itemId])) {
            continue
          }
          state[storeModule][storeModule][itemId] = serializeFunction(moduleState[storeModule][itemId], moduleState.jsorm)
        }
      } else {
        for (const itemId in moduleState) {
          if (!isJSORMObject(moduleState[itemId])) {
            continue
          }
          state[storeModule][itemId] = serializeFunction(moduleState[itemId], moduleState.jsorm)
        }
      }
    }
  }

  if (process.server) {
    beforeNuxtRender(function() {
      handleSerialization(store.state, serializeModel)
    })
  } else if (process.client) {
    let clonedState = JSON.parse(JSON.stringify(nuxtState.state))
    handleSerialization(clonedState, deserializeModel)
    store.replaceState(clonedState)
  }

  inject('orm', orm)
}
