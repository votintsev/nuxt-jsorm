import Vue from 'vue'
import { deserialize } from '~/plugins/orm'

export const state = () => ({
  customers: {},
  // required for hydration of JSORM
  jsorm: 'Customer'
})

export const mutations = {
  cacheCustomers(state, customers) {
    for (const customer in customers) {
      Vue.set(state.customers, customers[customer].id, customers[customer])
    }
  },
  cacheCustomer(state, customer) {
    Vue.set(state.customers, customer.id, customer)
  }
}

export const actions = {
  all({ commit, getters }) {
    return this.$orm.Customer.all()
      .then((result) => {
        commit('cacheCustomers', result.data)
        return getters.customers
      })
  },
  get({ commit }, customerId) {
    return this.$orm.Customer.find(customerId)
      .then((result) => {
        commit('cacheCustomer', result.data)
        return getters.customer(customerId)
      })
  },
  create({ commit, getters }, customer) {
    let Customer = new this.$orm.Customer(customer)
    return Customer.save()
      .then(async () => {
        Customer = await this.$orm.Customer.find(Customer.id).then(res => res.data)
        commit('cacheCustomer', Customer)
        return getters.customer(Customer.id)
      })
  }
}

export const getters = {
  customer: state => (id) => {
    if (!state.customers[id]) {
      return {}
    }

    return deserialize(state.customers[id])
  },
  customers(state) {
    const customers = deserialize(state.customers)
    return Object.keys(customers).map((k) => {
      return customers[k]
    })
  }
}
