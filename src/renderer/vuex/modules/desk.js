import * as types from '../types'
import api from '../../fetch/modules/desk'
const state = {
  deskLists: [],
  pageSize: 12,
  current_page: 1,
  total: 0
}

const getters = {
  'desk_get_desk': state => state.deskLists,
  'desk_get_pageSize': state => state.pageSize,
  'desk_get_currentPage': state => state.current_page,
  'desk_get_total': state => state.total
}

const mutations = {
  [types.DESK_SET_DESKLIST] (state, data) {
    state.deskLists = data.list
    state.total = data.total
  },
  [types.DESK_SET_CURENTPAGE] (state, current_page) {
    state.current_page = current_page
  },
  [types.DESK_SET_DESK_ITEM] (state, params) {
    state.deskLists.splice(params.index, 1, params.item)
  }
}

const actions = {
  desk_get_desk ({ commit }, params) {
    api.get_desklist(params.data).then(data => {
      let response = data.data
      if (parseInt(data.code) === 1) {
        commit(types.DESK_SET_DESKLIST, response)
      } else {
        if (typeof params.error === 'function') {
          params.error(data.msg)
        } else {
          console.log(data.msg)
        }
      }
    })
  },
  desk_set_current_page ({ commit }, current_page) {
    commit(types.DESK_SET_CURENTPAGE, current_page)
  },
  desk_delete_desk ({ commit }, params) {
    api.del_desk_ids(params.data).then(data => {
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
  desk_add_desk ({ commit }, params) {
    api.add_desk(params.data).then(data => {
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
  desk_edit_desk ({ commit }, params) {
    api.edit_desk(params.data).then(data => {
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
  desk_set_desk_status ({ commit }, params) {
    api.set_desk_status(params.data).then(data => {
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
  desk_set_desk_edit_item ({ commit }, params) {
    commit(types.DESK_SET_DESK_ITEM, params)
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
