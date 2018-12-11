import * as types from '../types'
import api from '../../fetch/modules/order'
const state = {
  ordersLists: [],
  pageSize: 12,
  current_page: 1,
  total: 0
}

const getters = {
  'order_get_order': state => state.ordersLists,
  'order_get_pageSize': state => state.pageSize,
  'order_get_currentPage': state => state.current_page,
  'order_get_total': state => state.total
}

const mutations = {
  [types.ORDER_SET_ORDERSLIST] (state, data) {
    state.ordersLists = data.list
    state.total = data.total
  },
  [types.ORDER_SET_CURENTPAGE] (state, current_page) {
    state.current_page = current_page
  },
  [types.ORDER_SET_ORDER_ITEM] (state, params) {
    state.ordersLists.splice(params.index, 1, params.item)
  }
}

const actions = {
  order_get_orders ({ commit }, params) {
    api.get_orderlist(params.data).then(data => {
      let response = data.data
      if (parseInt(data.code) === 1) {
        commit(types.ORDER_SET_ORDERSLIST, response)
      } else {
        if (typeof params.error === 'function') {
          params.error(data.msg)
        } else {
          console.log(data.msg)
        }
      }
    })
  },
  order_set_current_page ({ commit }, current_page) {
    commit(types.ORDER_SET_CURENTPAGE, current_page)
  },
  order_set_order_status ({ commit }, params) {
    api.set_order_status(params.data).then(data => {
      if (parseInt(data.code) === 1) {
        params.success(data.data)
      } else {
        if (typeof params.error === 'function') {
          params.error(data.msg)
        } else {
          console.log(data.msg)
        }
      }
    })
  },
  order_set_order_edit_item ({ commit }, params) {
    commit(types.ORDER_SET_ORDER_ITEM, params)
  },
  order_delete_order ({ commit }, params) {
    return new Promise((resolve, reject) => {
      api.delete_order(params.data).then(data => {
        let code = parseInt(data.code)
        if (code === 1) {
          resolve(data)
        } else {
          reject(data.msg)
        }
      }).catch(err => {
        reject(err.msg)
      })
    })
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
