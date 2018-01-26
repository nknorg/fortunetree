import axios from 'axios'

export default {
  actions: {
    verifyName({dispatch}, formData) {
      return axios.post(process.env.API_URL + 'verify-name', formData).then(response => {
        return response.data.data
      }).catch(error => {
        console.log(error)
      })
    },
    userRegister({dispatch}, formData) {
      return axios.post(process.env.API_URL + 'register', formData).then(response => {
        if (response.data.code === 1000) {
          return true
        }
        console.log(response.data)
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
