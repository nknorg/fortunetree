import * as types from '../mutation-type'
import axios from 'axios'

export default {
  state: {
    myComments: [],
    commentList: [],
    viewComment: false
  },
  mutations: {
    [types.SET_COMMENT_LIST](state, payload) {
      state.commentList = payload.comments
    },
    [types.GET_MY_COMMENT](state, payload) {
      state.myComments = payload.comments
    },
    [types.ADD_COMMENT_LIST](state, payload) {
      state.commentList.unshift(payload.comments)
      state.viewComment = false
    },
    [types.SHOW_COMMENT_AREA](state) {
      state.viewComment = !state.viewComment
    }
  },
  actions: {
    getComment({commit, dispatch}, articleId) {
      return axios.get(process.env.API_URL + 'comment/index/' + articleId).then(response => {
        commit({
          type: types.SET_COMMENT_LIST,
          comments: response.data.data.data
        })
      })
    },
    myCommentList({commit}) {
      return axios.get(process.env.API_URL + 'comment/my-comments').then(response => {
        commit({
          type: types.GET_MY_COMMENT,
          comments: response.data.data
        })
      }).catch(error => {
        dispatch('showNotification', {level: 'danger', msg: 'Get myCommentList error.'})
        return false
      })
    },
    postComment({commit, dispatch}, formData) {
      return axios.post(process.env.API_URL + 'comment/create', formData).then(response => {
        commit({
          type: types.ADD_COMMENT_LIST,
          comments: response.data.data
        })
        return true
      }).catch(error => {
        console.log(error)
        return false
      })
    },
    showCommentArea({commit}) {
      commit({
        type: types.SHOW_COMMENT_AREA
      })
    }
  }
}
