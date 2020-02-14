<template>
<section class="container">
  <template v-for="customer in customers">
    <h1
      :id="`customer-${customer.id}`"
      :key="customer.id"
      class="title"
    >
      Customer {{ customer.id }}: {{ customer.name }}
    </h1>
  </template>
</section>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('customers')
export default {
  async fetch({ store }) {
    await store.dispatch('customers/all')
  },
  computed: {
    ...mapGetters(['customers'])
  }
}
</script>

<style>
.container
{
  min-height: 100vh;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.title
{
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; /* 1 */
  display: block;
  width: 100%;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}
</style>
