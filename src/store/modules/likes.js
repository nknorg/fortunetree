import axios from 'axios'

export default {
  actions: {
    userLike({dispatch}, formData) {
      return axios.post(process.env.API_URL + 'like', formData).then(response => {
        return true
      }).catch(error => {
        return false
      })
    }
  }
}
