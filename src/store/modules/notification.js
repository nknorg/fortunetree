import * as types from '../mutation-type'

export default {
  state: {
    level: 'success', // danger, warning, info
    msg: null
  },
  mutations: {
    [types.SHOW_NOTIFICATION](state, payload) {
      state.level = payload.notification.level
      state.msg = payload.notification.msg
    },
    [types.HIDE_NOTIFICATION](state) {
      state.level = 'success'
      state.msg = null
    }
  },
  actions: {
    showNotification({commit}, notification) {
      commit({
        type: types.SHOW_NOTIFICATION,
        notification: notification
      })
    },
    hideNotification({commit}) {
      commit({
        type: types.HIDE_NOTIFICATION
      })
    }
  }
}
