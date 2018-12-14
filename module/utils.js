/* eslint-disable */
import { JSORMBase } from 'jsorm'
import orm from './models'

const deserializeModel = function({ attributes, relationships, id, isPersisted, isMarkedForDestruction, isMarkedForDisassociation, errors, model }) {
  let retRelationships = {}, attrs

  if(Object.keys(relationships).length > 0) {
    for (const relationship in relationships) {
      if (typeof retRelationships[relationship] === "undefined") {
        retRelationships[relationship] = []
      }

      const relatedItems = relationships[relationship]
      if (Array.isArray(relatedItems)) {
        for (const relatedItem in relatedItems) {
          retRelationships[relationship].push(deserializeModel(relatedItems[relatedItem]))
        }
      } else {
        retRelationships[relationship] = deserializeModel(relatedItems)
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

const deserialize = function(data, model) {
  if(isJSORMObject(data)) {
    if(data.isSerializedByNuxtJsOrm) {
      data = deserializeModel(data, model)
    }
  } else if(typeof data === "object") {
    for (const item in data) {
      if(isJSORMObject(data[item])) {
        if(data[item].isSerializedByNuxtJsOrm) {
          data[item] = deserializeModel(data[item], model)
        }
      }
    }
  }

  return data
}

const serializeModel = function({ attributes, relationships, id, isPersisted, isMarkedForDestruction, isMarkedForDisassociation, errors, getClassName }) {
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
    if (Array.isArray(relatedItems)) {
      for (const relatedItem in relatedItems) {
        ret.relationships[relationship].push(serializeModel(relatedItems[relatedItem]))
      }
    } else {
      ret.relationships[relationship] = serializeModel(relatedItems)
    }
  }

  return ret
}

const isJSORMObject = function(item) {
  if (typeof item !== "object") {
    return false
  }

  if (typeof item.isSerializedByNuxtJsOrm !== "undefined") {
    return true
  }

  if (item instanceof JSORMBase) {
    return true
  }

  return false
}

const handleStoreHydration = function(state, serializeFunction) {
  if (serializeFunction == 'serialize') {
    serializeFunction = serializeModel
  } else {
    serializeFunction = deserializeModel
  }
  for (const storeModule in state) {
    const moduleState = state[storeModule]
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
const index = { deserializeModel, deserialize, serializeModel, isJSORMObject, handleStoreHydration }
export { deserializeModel, deserialize, serializeModel, isJSORMObject, handleStoreHydration }
export default index
