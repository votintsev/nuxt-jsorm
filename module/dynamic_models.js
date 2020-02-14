/* eslint-disable */
import { SpraypaintBase, attr, hasMany, hasOne, belongsTo } from 'spraypaint'
const spraypaint = { SpraypaintBase, attr, hasMany, hasOne, belongsTo }

// Active models
<%= options.models.map(({ model, path }) => `import Create${model}Model from '${path.replace(/\\/g,'/')}'`).join('\n') %>

let orm = {
  '<%= options.parentModel %>': Create<%= options.parentModel %>Model(spraypaint.SpraypaintBase, 'initial')
}

<%= options.models.map(({ model, path, base }) => {
  if(base) return ''
  return `// ${model}\norm.${model} = Create${model}Model(orm.${options.parentModel}, spraypaint)`
}).join('\n\n') %>

export default orm
