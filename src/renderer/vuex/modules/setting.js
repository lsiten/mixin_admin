import * as types from '../types'
import api from '../../fetch/modules/setting'
const state = {
  settingLists: [],
  wxSettingData: {},
  pageSize: 12,
  current_page: 1,
  total: 0
}

const getters = {
  'setting_get_settings': state => state.settingLists,
  'setting_get_wx_settings': state => state.wxSettingData,
  'setting_get_pageSize': state => state.pageSize,
  'setting_get_currentPage': state => state.current_page,
  'setting_get_total': state => state.total
}

const mutations = {
  [types.SETTING_SET_SETTINGLIST] (state, data) {
    state.settingLists = data.list
    state.total = data.total
  },
  [types.SETTING_SET_WX_SETTING] (state, data) {
    state.wxSettingData = data.list[0]
  },
  [types.SETTING_SET_CURENTPAGE] (state, current_page) {
    state.current_page = current_page
  },
  [types.SETTING_SET_SETTING_ITEM] (state, params) {
    state.settingLists.splice(params.index, 1, params.item)
  }
}

const actions = {
  setting_get_wx_settings ({ commit }, params) {
    api.get_wx_settinglist(params.data).then(data => {
      let response = data.data
      if (parseInt(data.code) === 1) {
        commit(types.SETTING_SET_WX_SETTING, response)
      } else {
        if (typeof params.error === 'function') {
          params.error(data.msg)
        } else {
          console.log(data.msg)
        }
      }
    })
  },
  setting_get_settings ({ commit }, params) {
    api.get_settinglist(params.data).then(data => {
      let response = data.data
      if (parseInt(data.code) === 1) {
        commit(types.SETTING_SET_SETTINGLIST, response)
      } else {
        if (typeof params.error === 'function') {
          params.error(data.msg)
        } else {
          console.log(data.msg)
        }
      }
    })
  },
  setting_set_current_page ({ commit }, current_page) {
    commit(types.SETTING_SET_CURENTPAGE, current_page)
  },
  setting_delete_setting ({ commit }, params) {
    api.del_setting_ids(params.data).then(data => {
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
  setting_add_setting ({ commit }, params) {
    api.add_setting(params.data).then(data => {
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
  setting_edit_setting ({ commit }, params) {
    api.edit_setting(params.data).then(data => {
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
  setting_wx_edit_setting ({ commit }, params) {
    api.edit_wx_setting(params.data).then(data => {
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
  setting_set_setting_status ({ commit }, params) {
    api.set_setting_status(params.data).then(data => {
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
  setting_set_setting_edit_item ({ commit }, params) {
    commit(types.SETTING_SET_SETTING_ITEM, params)
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
