import Vue from 'vue'
import Vuex from 'vuex'

import Notification from './modules/notification'
import Register from './modules/register'
import UpdateProfile from './modules/update-profile'
import AuthUser from './modules/auth-user'
import Login from './modules/login'
import Post from './modules/post'
import Tags from './modules/tags'
import Likes from './modules/likes'
import Hates from './modules/hates'
import Comment from './modules/comment'

import BlockChain from './modules/block-chain'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    Notification,
    Register,
    UpdateProfile,
    AuthUser,
    Login,
    Post,
    Tags,
    Likes,
    Hates,
    Comment,
    BlockChain
  }
})
