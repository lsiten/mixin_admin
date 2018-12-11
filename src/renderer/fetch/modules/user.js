import fetch from '../api'
export default {
  login (params) {
    return fetch('/admin/login/login', params)
  },
  login_out (params) {
    return fetch('/admin/login/loginout', params)
  },
  get_userlist (params) {
    return fetch('/admin/user/getUserLists', params)
  },
  del_user_ids (params) {
    return fetch('/admin/user/deleteUser', params)
  },
  add_user (params) {
    return fetch('/admin/user/addnewuser', params)
  },
  edit_user (params) {
    return fetch('/admin/user/updateuserpassword', params)
  },
  set_user_status (params) {
    return fetch('/admin/user/setuserstatus', params)
  }
}
