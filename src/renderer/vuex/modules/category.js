import * as types from '../types'
import api from '../../fetch/modules/category'
const state = {
  categoryLists: [],
  pageSize: 12,
  current_page: 1,
  total: 0
}

const getters = {
  'category_get_category': state => state.categoryLists,
  'category_get_pageSize': state => state.pageSize,
  'category_get_currentPage': state => state.current_page,
  'category_get_total': state => state.total
}

const mutations = {
  [types.CATEGORY_SET_CATEGORYLIST] (state, data) {
    state.categoryLists = data.list
    state.total = data.total
  },
  [types.CATEGORY_SET_CURENTPAGE] (state, current_page) {
    state.current_page = current_page
  },
  [types.CATEGORY_SET_CATEGORY_ITEM] (state, params) {
    state.categoryLists.splice(params.index, 1, params.item)
  }
}

const actions = {
  category_get_categorys ({ commit }, params) {
    api.get_categorylist(params.data).then(data => {
      let response = data.data
      if (parseInt(data.code) === 1) {
        commit(types.CATEGORY_SET_CATEGORYLIST, response)
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
  category_set_current_page ({ commit }, current_page) {
    commit(types.CATEGORY_SET_CURENTPAGE, current_page)
  },
  category_delete_category ({ commit }, params) {
    api.del_category_ids(params.data).then(data => {
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
  category_add_category ({ commit }, params) {
    api.add_category(params.data).then(data => {
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
  category_edit_category ({ commit }, params) {
    api.edit_category(params.data).then(data => {
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
  category_set_category_status ({ commit }, params) {
    api.set_category_status(params.data).then(data => {
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
  category_upload_file ({ commit }, params) {
    return new Promise((resolve, reject) => {
      api.upload_category_thumb(params).then(res => {
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
  category_set_category_edit_item ({ commit }, params) {
    commit(types.CATEGORY_SET_CATEGORY_ITEM, params)
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
