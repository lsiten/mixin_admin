import fetch from '../api'
export default {
  get_bannerlist (params) {
    return fetch('/admin/banners/getBannerLists', params)
  },
  add_banner (params) {
    return fetch('/admin/banners/addBanners', params)
  },
  edit_banner (params) {
    return fetch('/admin/banners/updateBanner', params)
  },
  del_banner_ids (params) {
    return fetch('/admin/banners/deleteBanner', params)
  },
  set_banner_status (params) {
    return fetch('/admin/banners/setBannerStatus', params)
  }
}
