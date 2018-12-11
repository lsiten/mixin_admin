import fetch from '../api'
export default {
  get_categorylist (params) {
    return fetch('/admin/Category/getCategoryList', params)
  },
  add_category (params) {
    return fetch('/admin/Category/addCategory', params)
  },
  edit_category (params) {
    return fetch('/admin/Category/updateCategory', params)
  },
  del_category_ids (params) {
    return fetch('/admin/Category/deleteCategory', params)
  },
  set_category_status (params) {
    return fetch('/admin/Category/setCategoryStatus', params)
  },
  upload_category_thumb (params) {
    return fetch(params.host, params.data)
  }
}
