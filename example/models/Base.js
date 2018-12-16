// JSORMBase gets passed in by plugin
export default function (JSORMBase) {
  return JSORMBase.extend({
    static: {
      baseUrl: `http://localhost:3030`,
      apiNamespace: '/api',
      // generateAuthHeader function required as @nuxtjs/auth stores
      // tokens with the full authorization string, i.e 'Bearer asdf`
      generateAuthHeader: function (token) {
        return token
      },
      // this should be set to the same localStorage key as @nuxtjs/auth
      // will be read by JSORM on the client-side, while the
      // jwt property gets set on the server side
      jwtStorage: 'auth.token.local'
    }
  })
}
