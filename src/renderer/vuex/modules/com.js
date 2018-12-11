import api from '../../fetch/modules/com'
const state = {
  main: 0
}

const mutations = {
  DECREMENT_MAIN_COUNTER (state) {
    state.main--
  },
  INCREMENT_MAIN_COUNTER (state) {
    state.main++
  }
}

const actions = {
  com_get_img_token ({ commit }, param) {
    return new Promise((resolve, reject) => {
      api.getSignature(param).then(res => {
        if (parseInt(res.result) === 0) {
          resolve(res.data)
        } else {
          reject(res)
        }
      }).catch(err => {
        reject(err)
      })
    })
  }
}

export default {
  state,
  mutations,
  actions
}
