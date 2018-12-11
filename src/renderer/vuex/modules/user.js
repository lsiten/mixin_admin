import * as types from '../types'
import api from '../../fetch/modules/user'
const state = {
  token: localStorage.getItem('xuelv_token') || '',
  uid: localStorage.getItem('xuelv_uid') || '',
  userLists: [],
  pageSize: 12,
  current_page: 1,
  total: 0
}

const getters = {
  'user_get_token': state => {
    let token = state.token || localStorage.getItem('xuelv_token')
    return token
  },
  'user_get_uid': state => {
    let uid = state.uid || localStorage.getItem('xuelv_uid')
    return uid
  },
  'user_get_uname': state => {
    let uname = localStorage.getItem('xuelv_uname')
    return uname
  },
  'user_get_users': state => state.userLists,
  'user_get_pageSize': state => state.pageSize,
  'user_get_currentPage': state => state.current_page,
  'user_get_total': state => state.total
}

const mutations = {
  [types.USER_SET_TOKEN] (state, token) {
    state.token = token
  },
  [types.USER_SET_UID] (state, uid) {
    state.uid = uid
  },
  [types.USER_CLEAR_STORE] (state) {
    localStorage.removeItem('xuelv_token')
    localStorage.removeItem('xuelv_uid')
    localStorage.removeItem('xuelv_uname')
  },
  [types.USER_INFO_STORE] (state, info) {
    localStorage.setItem('xuelv_token', info.token)
    localStorage.setItem('xuelv_uid', info.id)
    localStorage.setItem('xuelv_uname', info.name)
    localStorage.setItem('xuelv_last_ip', info.last_login_ip)
    localStorage.setItem('xuelv_last_time', info.last_login_time)
    localStorage.setItem('xuelv_role', info.super)
  },
  [types.USER_SET_USERLIST] (state, data) {
    state.userLists = data.list
    state.total = data.total
  },
  [types.USER_SET_CURENTPAGE] (state, current_page) {
    state.current_page = current_page
  },
  [types.USER_SET_USER_ITEM] (state, params) {
    state.userLists.splice(params.index, 1, params.item)
  }
}

const actions = {
  user_login ({ commit }, params) {
    // do something async
    api.login(params.data).then(data => {
      let response = data.data
      if (parseInt(data.code) === 1) {
        commit(types.USER_SET_TOKEN, response.token)
        commit(types.USER_SET_UID, response.id)
        commit(types.USER_INFO_STORE, response)
        params.success(response)
      } else {
        if (typeof params.error === 'function') {
          params.error(data.msg)
        } else {
          console.log(data.msg)
        }
      }
    })
  },
  user_loginout ({ commit }, params) {
    api.login_out(params.data).then(data => {
      if (parseInt(data.code) === 1) {
        commit(types.USER_CLEAR_STORE)
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
  user_get_users ({ commit }, params) {
    api.get_userlist(params.data).then(data => {
      let response = data.data
      if (parseInt(data.code) === 1) {
        commit(types.USER_SET_USERLIST, response)
      } else {
        if (typeof params.error === 'function') {
          params.error(data.msg)
        } else {
          console.log(data.msg)
        }
      }
    })
  },
  user_set_current_page ({ commit }, current_page) {
    commit(types.USER_SET_CURENTPAGE, current_page)
  },
  user_delete_user ({ commit }, params) {
    api.del_user_ids(params.data).then(data => {
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
  user_add_user ({ commit }, params) {
    api.add_user(params.data).then(data => {
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
  user_edit_user ({ commit }, params) {
    api.edit_user(params.data).then(data => {
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
  user_set_user_status ({ commit }, params) {
    api.set_user_status(params.data).then(data => {
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
  user_set_user_edit_item ({ commit }, params) {
    commit(types.USER_SET_USER_ITEM, params)
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
