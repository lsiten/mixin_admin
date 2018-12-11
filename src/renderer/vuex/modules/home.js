import * as types from '../types'
import api from '../../fetch/modules/home'
const state = {
  dataDetail: {},
  todoList: (localStorage.getItem('xuelv_todolist') && JSON.parse(localStorage.getItem('xuelv_todolist'))) || []
}

const getters = {
  'home_get_detail': state => state.dataDetail,
  'home_get_todoList': state => state.todoList
}

const mutations = {
  [types.HOME_SET_DETAIL] (state, dataDetail) {
    state.dataDetail = dataDetail
  },
  [types.HOME_SET_TODOLIST] (state, todoList) {
    state.todoList = todoList
  },
  [types.HOME_ADD_TODOLIST] (state, todolist) {
    todolist.status = false
    state.todoList.push(todolist)
    localStorage.setItem('xuelv_todolist', JSON.stringify(state.todoList))
  },
  [types.HOME_EDIT_TODOLIST] (state, params) {
    let index = params.index
    state.todoList.splice(index, 1, params.data)
    localStorage.setItem('xuelv_todolist', JSON.stringify(state.todoList))
  },
  [types.HOME_CHECKCHANGE_TODOLIST] (state, index) {
    state.todoList[index].status = !state.todoList[index].status
    localStorage.setItem('xuelv_todolist', JSON.stringify(state.todoList))
  },
  [types.HOME_DELETE_TODOLIST] (state, index) {
    state.todoList.splice(index, 1)
    localStorage.setItem('xuelv_todolist', JSON.stringify(state.todoList))
  }
}

const actions = {
  home_get_data_detail ({ commit }, params) {
    // do something async
    api.get_home_data_detail(params.data).then(data => {
      let response = data.data
      if (parseInt(data.code) === 1) {
        commit(types.HOME_SET_DETAIL, response)
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
  home_add_todoList ({ commit }, data) {
    return new Promise((resolve, reject) => {
      commit(types.HOME_ADD_TODOLIST, data)
      resolve()
    })
  },
  home_edit_todoList ({ commit }, data) {
    return new Promise((resolve, reject) => {
      commit(types.HOME_EDIT_TODOLIST, data)
      resolve()
    })
  },
  home_check_todoList_item ({ commit }, index) {
    commit(types.HOME_CHECKCHANGE_TODOLIST, index)
  },
  home_delete_todoList ({ commit }, index) {
    return new Promise((resolve, reject) => {
      commit(types.HOME_DELETE_TODOLIST, index)
      resolve()
    })
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
