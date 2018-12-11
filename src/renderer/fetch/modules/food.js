import fetch from '../api'
export default {
  get_foodlist (params) {
    return fetch('/admin/food/getFoodLists', params)
  },
  add_food (params) {
    return fetch('/admin/food/addFood', params)
  },
  edit_food (params) {
    return fetch('/admin/food/updateFood', params)
  },
  del_food_ids (params) {
    return fetch('/admin/food/deleteFood', params)
  },
  set_food_status (params) {
    return fetch('/admin/food/setFoodStatus', params)
  }
}
