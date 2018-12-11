import fetch from '../api'
export default {
  get_desklist (params) {
    return fetch('/admin/desks/getDeskLists', params)
  },
  add_desk (params) {
    return fetch('/admin/desks/addDesk', params)
  },
  edit_desk (params) {
    return fetch('/admin/desks/updateDesk', params)
  },
  del_desk_ids (params) {
    return fetch('/admin/desks/deleteDesk', params)
  },
  set_desk_status (params) {
    return fetch('/admin/desks/setDeskStatus', params)
  }
}
