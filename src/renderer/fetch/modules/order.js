import fetch from '../api'
export default {
  get_orderlist (params) {
    return fetch('/admin/order/getOrderList', params)
  },
  set_order_status (params) {
    return fetch('/admin/order/setOrderStatus', params)
  },
  delete_order (params) {
    return fetch('/admin/order/deleteOrder', params)
  }
}
