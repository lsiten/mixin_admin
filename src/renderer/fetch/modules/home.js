import fetch from '../api'
export default {
  get_home_data_detail (params) {
    return fetch('/admin/index/getHomePageInfo', params)
  }
}
