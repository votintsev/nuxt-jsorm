DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
if [ -L $DIR/node_modules/nuxt-jsorm ] && [ -e $DIR/node_modules/nuxt-jsorm ] ; then
  echo "Already setup"
else
  echo "Setting up link"
  ln -s $DIR $DIR/node_modules/nuxt-jsorm
fi
