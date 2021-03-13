import { action, createModule, mutation } from 'vuex-class-component'
import { OrderItem } from '~/types/orders'

export class OrdersStore extends createModule({
  target: 'nuxt',
  namespaced: 'orders'
}) {
  newOrders: OrderItem[] = []

  @action async AddNewOrder (payload: OrderItem) {
    this.ADD_NEW_ORDER(payload)
  }

  @mutation ADD_NEW_ORDER (payload: OrderItem) {
    this.newOrders.push({ ...payload })
  }

  get orderList () {
    return this.newOrders[this.newOrders.length - 1]
  }
}
