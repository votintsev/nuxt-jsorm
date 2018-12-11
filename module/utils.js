/* eslint-disable */
import { JSORMBase } from 'jsorm'

deserializeModel = function({ attributes, relationships, id, isPersisted, isMarkedForDestruction, isMarkedForDisassociation, errors, model }) {
  let retRelationships = {}, attrs

  if(Object.keys(relationships).length > 0) {
    for (const relationship in relationships) {
      if (typeof retRelationships[relationship] === "undefined") {
        retRelationships[relationship] = []
      }

      const relatedItems = relationships[relationship]

      for (const relatedItem in relatedItems) {
        retRelationships[relationship].push(deserializeModel(relatedItems[relatedItem]))
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

deserialize = function(data, model) {
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

serializeModel = function({ attributes, relationships, id, isPersisted, isMarkedForDestruction, isMarkedForDisassociation, errors, getClassName }) {
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
      ret.relationships[relationship].push(serializeModel(relatedItems[relatedItem]))
    }
  }

  return ret
}

isJSORMObject = function(item) {
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

let utils_esm = {
  deserializeModel,
  deserialize,
  serializeModel,
  isJSORMObject
}
export { deserializeModel, deserialize, serializeModel, isJSORMObject }
export default utils_esm
