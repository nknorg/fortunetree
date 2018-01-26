import axios from 'axios'
import * as types from "../mutation-type"

export default {
  state: {
    myBlogList: [],
    blogList: [],
    blog: []
  },
  mutations: {
    [types.GET_MY_BLOG](state, payload) {
      state.myBlogList = payload.blog
    },
    [types.BLOG_LIST](state, payload) {
      state.blogList = payload.blog
    },
    [types.GET_BLOG](state, payload) {
      state.blog = payload.blog
    }
  },
  actions: {
    postRequest({dispatch}, formData) {
      return axios.post(process.env.API_URL + 'post/create', formData).then(response => {
        let newPostId = response.data.data.id
        dispatch('postArticle_inBC', formData.content).then(response => {
          if (response.Desc === 'SUCCESS') {
            const formData = {
              id: newPostId,
              txid: response.Result
            }
            dispatch('updatePostRequest', formData)
          } else {
            console.log('Code: ' + response.Error + '; Desc: ' + response.Desc + '.')
          }
        }).catch(error => {
          console.log(error)
        })
      }).catch(error => {
        console.log(error)
        dispatch('showNotification', {level: 'danger', msg: 'Something Err!'})
        return false
      })
    },
    updatePostRequest({dispatch}, formData) {
      return axios.post(process.env.API_URL + 'post/txid', formData).then(response => {
      }).catch(error => {
        console.log(error)
      })
    },
    myPostList({dispatch, commit}) {
      return axios.get(process.env.API_URL + 'post/my-blog').then(response => {
        commit({
          type: types.GET_MY_BLOG,
          blog: response.data.data
        })
      }).catch(error => {
        dispatch('showNotification', {level: 'danger', msg: 'Get myPostList error.'})
        return false
      })
    },

    // change blog data
    commitBlog({commit}, responseData) {
      commit({
        type: types.GET_BLOG,
        blog: responseData
      })
    },
    oneBlog({dispatch}, id) {
      return axios.get(process.env.API_URL + 'post/blog/' + id).then(response => {
        dispatch('commitBlog', response.data.data)
      }).catch(error => {
        return axios.get(process.env.API_URL + 'blog/' + id).then(response => {
          dispatch('commitBlog', response.data.data)
        })
      })
    },

    // change blog list data
    commitBlogList({commit}, responseData) {
      commit({
        type: types.BLOG_LIST,
        blog: responseData
      })
    },
    setBlogList({dispatch, commit}, blogData) {
      let blogArr = blogData.data
      let authorArr = []

      // get authors
      for (let i = 0; i < blogArr.length; i++) {
        authorArr.push(blogArr[i].author)
      }

      dispatch('getUserList_inBC', authorArr).then(response => {
        for (let m = 0; m < blogArr.length; m++) {
          for (let n = 0; n < response.length; n++) {
            if (blogArr[m].author === response[n].Username) {
              blogArr[m].honorVal = parseFloat(response[n].Reputation)
            }
          }
        }

        blogData.data = blogArr
        dispatch('commitBlogList', blogData)
      })
    },
    axiosGetBlogListData({dispatch}, path) {
      return axios.get(process.env.API_URL + 'post/' + path).then(response => {
        dispatch('setBlogList', response.data.data)
      }).catch(error => {
        return axios.get(process.env.API_URL + path).then(response => {
          dispatch('setBlogList', response.data.data)
        })
      })
    },
    normalPostList({dispatch}) {
      dispatch('axiosGetBlogListData', 'blogs')
    },
    newPostList({dispatch}) {
      dispatch('axiosGetBlogListData', 'new-blog')
    },
    hotPostList({dispatch}) {
      dispatch('axiosGetBlogListData', 'hot-blog')
    },
    tagPostList({dispatch}, tagName) {
      dispatch('axiosGetBlogListData', 'tag-blog/' + tagName)
    }
  }
}
