import JwtToken from '../../helpers/jwt'
import axios from 'axios'
import * as types from "../mutation-type";

export default {
  actions: {
    loginRequest({dispatch}, formData) {
      return axios.post(process.env.API_URL + 'login', formData).then(response => {
        dispatch('loginSuccess', response.data)
      }).catch(error => {
        dispatch('showNotification', {level: 'danger', msg: 'User name or password is incorrect.'})
        return false
      })
    },
    loginSuccess({dispatch}, tokenResponse) {
      JwtToken.setToken(tokenResponse.token)
      JwtToken.setAuthId(tokenResponse.auth_id)
      dispatch('setAuthUser')
    },
    logoutRequest({dispatch}) {
      return axios.post(process.env.API_URL + 'logout').then(response => {
        JwtToken.removeToken()
        dispatch('unsetAuthUser')
      })
    }
  }
}
