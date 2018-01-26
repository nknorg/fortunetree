import axios from 'axios'

export default {
  actions: {
    updateRegisterStatusRequest({dispatch}, username) {
      let formData = {
        name: username
      }
      return axios.post(process.env.API_URL + 'update/status', formData).then(response => {
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
