import * as types from '../types'
import api from '../../fetch/modules/food'
const state = {
  foodLists: [],
  pageSize: 12,
  current_page: 1,
  total: 0
}

const getters = {
  'food_get_food': state => state.foodLists,
  'food_get_pageSize': state => state.pageSize,
  'food_get_currentPage': state => state.current_page,
  'food_get_total': state => state.total
}

const mutations = {
  [types.FOOD_SET_FOODLIST] (state, data) {
    state.foodLists = data.list
    state.total = data.total
  },
  [types.FOOD_SET_CURENTPAGE] (state, current_page) {
    state.current_page = current_page
  },
  [types.FOOD_SET_FOOD_ITEM] (state, params) {
    state.foodLists.splice(params.index, 1, params.item)
  }
}

const actions = {
  food_get_food ({ commit }, params) {
    api.get_foodlist(params.data).then(data => {
      let response = data.data
      if (parseInt(data.code) === 1) {
        commit(types.FOOD_SET_FOODLIST, response)
      } else {
        if (typeof params.error === 'function') {
          params.error(data.msg)
        } else {
          console.log(data.msg)
        }
      }
    })
  },
  food_set_current_page ({ commit }, current_page) {
    commit(types.FOOD_SET_CURENTPAGE, current_page)
  },
  food_delete_food ({ commit }, params) {
    api.del_food_ids(params.data).then(data => {
      if (parseInt(data.code) === 1) {
        params.success()
      } else {
        if (typeof params.error === 'function') {
          params.error(data.msg)
        } else {
          console.log(data.msg)
        }
      }
    })
  },
  food_add_food ({ commit }, params) {
    api.add_food(params.data).then(data => {
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
  food_edit_food ({ commit }, params) {
    api.edit_food(params.data).then(data => {
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
  food_set_food_status ({ commit }, params) {
    api.set_food_status(params.data).then(data => {
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
  food_upload_file ({ commit }, params) {
    return new Promise((resolve, reject) => {
      api.upload_food_thumb(params).then(res => {
        console.log(res)
        if (parseInt(res.result) === 0) {
          resolve(res.data)
        } else {
          reject(res)
        }
      }).catch(err => {
        reject(err)
      })
    })
  },
  food_set_food_edit_item ({ commit }, params) {
    commit(types.FOOD_SET_FOOD_ITEM, params)
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
