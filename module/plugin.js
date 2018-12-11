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

  orm.deserializeModel = function({ attributes, relationships, id, isPersisted, isMarkedForDestruction, isMarkedForDisassociation, errors, model }) {
    let retRelationships = {}, attrs

    if(Object.keys(relationships).length > 0) {
      for (const relationship in relationships) {
        if (typeof retRelationships[relationship] === "undefined") {
          retRelationships[relationship] = []
        }

        const relatedItems = relationships[relationship]

        for (const relatedItem in relatedItems) {
          retRelationships[relationship].push(orm.deserializeModel(relatedItems[relatedItem]))
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

  orm.deserialize = function(data, model) {
    if(orm.isJSORMObject(data)) {
      if(data.isSerializedByNuxtJsOrm) {
        data = orm.deserializeModel(data, model)
      }
    } else if(typeof data === "object") {
      for (const item in data) {
        if(orm.isJSORMObject(data[item])) {
          if(data[item].isSerializedByNuxtJsOrm) {
            data[item] = orm.deserializeModel(data[item], model)
          }
        }
      }
    }

    return data
  }

  orm.serializeModel = function({ attributes, relationships, id, isPersisted, isMarkedForDestruction, isMarkedForDisassociation, errors, getClassName }) {
    console.log()
    let ret = {
      attributes: Object.assign({}, attributes),
      relationships: {},
      id,
      isPersisted,
      isMarkedForDestruction,
      isMarkedForDisassociation,
      isSerializedByNuxtJsOrm: true,
      model: getClassName(),
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
        ret.relationships[relationship].push(orm.serializeModel(relatedItems[relatedItem]))
      }
    }

    return ret
  }

  orm.isJSORMObject = function(item) {
    if (typeof item !== "object") {
      return false
    }

    if (typeof item.isSerializedByNuxtJsOrm !== "undefined") {
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
            if (!orm.isJSORMObject(accountData[storeModule][itemId])) {
              continue
            }
            state[storeModule].by_account[accountId][storeModule][itemId] = serializeFunction(accountData[storeModule][itemId], moduleState.jsorm)
          }
        }
      } else if (typeof moduleState[storeModule] !== "undefined") {
        for (const itemId in moduleState[storeModule]) {
          if (!orm.isJSORMObject(moduleState[storeModule][itemId])) {
            continue
          }
          state[storeModule][storeModule][itemId] = serializeFunction(moduleState[storeModule][itemId], moduleState.jsorm)
        }
      } else {
        for (const itemId in moduleState) {
          if (!orm.isJSORMObject(moduleState[itemId])) {
            continue
          }
          state[storeModule][itemId] = serializeFunction(moduleState[itemId], moduleState.jsorm)
        }
      }
    }
  }

  if (process.server) {
    beforeNuxtRender(function(something) {
      handleSerialization(store.state, orm.serializeModel)
    })
  } else if (process.client) {
    let clonedState = JSON.parse(JSON.stringify(nuxtState.state))
    handleSerialization(clonedState, orm.deserializeModel)
    store.replaceState(clonedState)
  }

  inject('orm', orm)
}
