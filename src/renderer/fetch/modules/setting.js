import fetch from '../api'
export default {
  get_settinglist (params) {
    return fetch('/admin/system_info/getSystemInfoList', params)
  },
  get_wx_settinglist (params) {
    return fetch('/admin/system_info/getWeixinSetList', params)
  },
  del_setting_ids (params) {
    return fetch('/admin/system_info/deleteSystemInfo', params)
  },
  add_setting (params) {
    return fetch('/admin/system_info/addSystemInfo', params)
  },
  edit_setting (params) {
    return fetch('/admin/system_info/updateSystemInfo', params)
  },
  edit_wx_setting (params) {
    return fetch('/admin/system_info/updateWeixinSet', params)
  },
  set_setting_status (params) {
    return fetch('/admin/system_info/setSystemInfoStatus', params)
  }
}
