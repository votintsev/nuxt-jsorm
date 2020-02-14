// First argument is the Base model created from Base.js
// Second argument is the Spraypaint package itself
// For more usage examples check the Spraypaint documentation
// https://www.graphiti.dev/js/index
export default function (BaseModel, { attr }) {
  return BaseModel.extend({
    static: {
      jsonapiType: 'customers'
    },
    attrs: {
      id: attr(),
      name: attr()
    },
    methods: {
      // Utilized by the nuxt-jsorm package for hydration
      // the value returned by this function should be the
      // same name as the filename of the model, i.e for
      // Customer.js the value returned is 'Customer' or
      // for FooBar.js the value returned should be 'FooBar'
      getClassName: () => 'Customer'
    }
  })
}
