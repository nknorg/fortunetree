import axios from 'axios'

export default {
  actions: {
    userHate({dispatch}, formData) {
      return axios.post(process.env.API_URL + 'hate', formData).then(response => {
        return true
      }).catch(error => {
        return false
      })
    }
  }
}
