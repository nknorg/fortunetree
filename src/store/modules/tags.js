import * as types from '../mutation-type'
import axios from 'axios'

export default {
  state: {
    tagList: []
  },
  mutations: {
    [types.GET_TAGS](state, payload) {
      state.tagList = payload.tag
    }
  },
  actions: {
    getTags({commit}) {
      return axios.get(process.env.API_URL + 'tags/list').then(response => {
        commit({
          type: types.GET_TAGS,
          tag: response.data.data.data
        })
      })
    }
  }
}
