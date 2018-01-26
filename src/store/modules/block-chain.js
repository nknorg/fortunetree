import axios from 'axios'
import * as types from "../mutation-type"
import qs from 'qs'

export default {
  state: {
    AccountInfo: {
      privateKey: '',
      publicKeyEncoded: '',
      publicKey: '',
      programHash: '',
      address: ''
    },
    UserInfo: {
      ProgramHash: '',
      Reputation: 0,
      TotalToken: 0,
      WithdrawnToken: 0
    }
  },
  mutations: {
    [types.GENERATE_ACCOUNT_INFO](state, payload) {
      state.AccountInfo = payload.info
    },
    [types.SET_USER_INFO](state, payload) {
      state.UserInfo = payload.info
    }
  },
  actions: {
    isAlready_inBC({dispatch}, username) {
      return axios.get(process.env.BC_URL + 'userinfo/' + username).then(response => {
        if (response.data.Desc === 'INVALID USER') {
          return true
        } else {
          dispatch('showNotification', {level: 'danger', msg: 'Username already exists.'})
        }
      }).catch(error => {
        console.log(error)
      })
    },
    generateAccountInfo({dispatch, commit}, password) {
      return dispatch('setAuthUser').then(response => {
        let privateKey = Wallet.generatePrivateKey(this.state.AuthUser.name, password)
        let accountInfo = Wallet.GetAccountInfoFromPrivateKey(privateKey)
        commit({
          type: types.GENERATE_ACCOUNT_INFO,
          info: accountInfo
        })
      })
    },
    getUserInfo_inBC({commit}) {
      return axios.get(process.env.BC_URL + 'userinfo/' + this.state.AuthUser.name).then(response => {
        commit({
          type: types.SET_USER_INFO,
          info: response.data.Result
        })
        return response.data
      }).catch(error => {
        console.log(error)
      })
    },
    getUserList_inBC({commit}, authorArr) {
      let formData = {
        Userlist: authorArr
      }
      return axios.post(process.env.BC_URL + 'userlist', formData).then(response => {
        return response.data.Result
      }).catch(error => {
        console.log(error)
        return false
      })
    },
    userRegister_inBC({dispatch}, formData) {
      let privateKey = Wallet.generatePrivateKey(formData.name, formData.password)
      let accountInfo = Wallet.GetAccountInfoFromPrivateKey(privateKey)
      const defaultHonorVal = '100'
      let txRawData = Transaction.userRegister(formData.name, defaultHonorVal, accountInfo.publicKeyEncoded)
      return dispatch('axiosPost_inBC', txRawData).then(response => {
        if (response !== false && response.Error === 0) {
          return dispatch('updateRegisterStatusRequest', formData.name).then(response => {
            return true
          }).catch(error => {
            console.log(error)
            return false
          })
        } else {
          return response
        }
      })
    },
    postArticle_inBC({dispatch}, content) {
      let txRawData = Transaction.postArticle(this.state.AuthUser.name, content, this.state.BlockChain.AccountInfo)
      return dispatch('axiosPost_inBC', txRawData).then(response => {
        if (response.Desc !== 'SUCCESS') {
          console.log(response)
        }
        return response
      })
    },
    likeArticle_inBC({dispatch}, likeData) {
      let txRawData = Transaction.likeArticle(this.state.AuthUser.name, likeData.txid, this.state.BlockChain.AccountInfo, true)
      return dispatch('axiosPost_inBC', txRawData).then(response => {
        if (response.Desc !== 'SUCCESS') {
          console.log(response)
        }
        return response
      })
    },
    hateArticle_inBC({dispatch}, hateData) {
      let txRawData = Transaction.likeArticle(this.state.AuthUser.name, hateData.txid, this.state.BlockChain.AccountInfo, false)
      return dispatch('axiosPost_inBC', txRawData).then(response => {
        if (response.Desc !== 'SUCCESS') {
          console.log(response)
        }
        return response
      })
    },
    replyArticle_inBC({dispatch}, replyData) {
      let txRawData = Transaction.replyArticle(this.state.AuthUser.name, replyData.txid, replyData.commentContent, this.state.BlockChain.AccountInfo)
      return dispatch('axiosPost_inBC', txRawData).then(response => {
        if (response.Desc !== 'SUCCESS') {
          console.log(response)
        }
        return response
      })
    },
    withdrawal_inBC({dispatch}, withdrawalData) {
      //TODO assetID
      const assetID = '98899817878ed54082577ab9a64f41127405c6ce7b8fadf698692ef9dfdd3172'

      let txRawData = Transaction.withdrawal(this.state.AuthUser.name, assetID, withdrawalData.amount, withdrawalData.toAddress, this.state.BlockChain.AccountInfo)
      return dispatch('axiosPost_inBC', txRawData).then(response => {
        if (response.Desc !== 'SUCCESS') {
          console.log(response)
        }
        return response
      })
    },
    /**
     * Ret format
     *
     * { "Action": "xxx",
     *   "Desc": "SUCCESS",
     *   "Error": 0,
     *   "Result": { },
     *   "Version": "1.0.0" }
     *
     * { "Action": "xxx",
     *   "Desc": "INVALID USER",
     *   "Error": 42004,
     *   "Result": "",
     *   "Version": "1.0.0" }
     *
     * @param {dispatch}
     * @param $txRawData
     * @return {Promise<AxiosResponse>}
     */
    axiosPost_inBC({dispatch}, $txRawData) {
      let formData = {
        Action: "sendrawtransaction",
        Version: "1.0.0",
        Type: "",
        Data: $txRawData
      }

      return axios.post(process.env.BC_URL + 'transaction', formData).then(response => {
        return response.data
      }).catch(error => {
        console.log(error)
        return false
      })
    }
  }
}
