/* eslint-disable */
var jsorm = require('jsorm')

// Active models
<%= options.models.map(({ model, path }) => `import Create${model}Model from '${path.replace(/\\/g,'/')}'`).join('\n') %>

let orm = {
  <%= options.parentModel %>: Create<%= options.parentModel %>Model(jsorm.JSORMBase, 'initial')
}

<%=
options.models.map(({ model, path, base }) => {
  if(base) return ''
  return `// ${model}\norm.${model} = Create${model}Model(orm.${options.parentModel}, jsorm)`
}).join('\n\n')
%>

export default orm
