/* eslint-disable */
import * as jsorm from 'jsorm'
import Vue from 'vue'
import { JSORMVue } from 'jsorm-vue'
require('isomorphic-fetch')

Vue.use(JSORMVue)

// Active models
<%= options.models.map(({ model, path }) => `import Create${model}Model from '${path.replace(/\\/g,'/')}'`).join('\n') %>

export default function ({ app }, inject) {
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

  inject('orm', orm)
}
