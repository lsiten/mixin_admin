import * as types from '../types'
import api from '../../fetch/modules/banner'
const state = {
  bannerLists: [],
  pageSize: 12,
  current_page: 1,
  total: 0
}

const getters = {
  'banner_get_banner': state => state.bannerLists,
  'banner_get_pageSize': state => state.pageSize,
  'banner_get_currentPage': state => state.current_page,
  'banner_get_total': state => state.total
}

const mutations = {
  [types.BANNER_SET_BANNERLIST] (state, data) {
    state.bannerLists = data.list
    state.total = data.total
  },
  [types.BANNER_SET_CURENTPAGE] (state, current_page) {
    state.current_page = current_page
  },
  [types.BANNER_SET_BANNER_ITEM] (state, params) {
    state.bannerLists.splice(params.index, 1, params.item)
  }
}

const actions = {
  banner_get_banner ({ commit }, params) {
    api.get_bannerlist(params.data).then(data => {
      let response = data.data
      if (parseInt(data.code) === 1) {
        commit(types.BANNER_SET_BANNERLIST, response)
      } else {
        if (typeof params.error === 'function') {
          params.error(data.msg)
        } else {
          console.log(data.msg)
        }
      }
    })
  },
  banner_set_current_page ({ commit }, current_page) {
    commit(types.BANNER_SET_CURENTPAGE, current_page)
  },
  banner_delete_banner ({ commit }, params) {
    api.del_banner_ids(params.data).then(data => {
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
  banner_add_banner ({ commit }, params) {
    api.add_banner(params.data).then(data => {
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
  banner_edit_banner ({ commit }, params) {
    api.edit_banner(params.data).then(data => {
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
  banner_set_banner_status ({ commit }, params) {
    api.set_banner_status(params.data).then(data => {
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
  banner_set_banner_edit_item ({ commit }, params) {
    commit(types.BANNER_SET_BANNER_ITEM, params)
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
