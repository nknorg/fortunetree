<template>
  <div class="wallet">
    <profile></profile>
    <profile-top-nav></profile-top-nav>

    <div class="container">
      <div class="input-group user-chain-address">
        <div class="input-group-addon"><i class="fa fa-home" aria-hidden="true"></i></div>
        <input v-model="accountInfo.address" type="text" class="form-control" disabled placeholder="Your address">
      </div>
      <div class="input-group user-chain-other">
        <div class="input-group-addon"><i class="fa fa-btc" aria-hidden="true"></i></div>
        <input v-model="userInfo.TotalToken" type="text" class="form-control" disabled placeholder="Total Token" title="Balance can be withdrawn">
      </div>
      <div class="input-group user-chain-other">
        <div class="input-group-addon"><i class="fa fa-cny" aria-hidden="true"></i></div>
        <input v-model="userInfo.WithdrawnToken" type="text" class="form-control" disabled placeholder="Withdrawn Token" title="The balance has been withdrawn">
      </div>


      <form @submit.prevent="withdrawal">
        <div class="form-group">
          <div class="input-group withdrawal-input-address">
            <div class="input-group-addon"><i class="fa fa-paper-plane" aria-hidden="true"></i></div>
            <input v-model="toAddress"
                   v-validate data-vv-rules="required" data-vv-as="to address"
                   :class="{'input': true, 'is-danger': errors.has('to-address') }"
                   type="text" class="form-control" name="to-address" placeholder="To address">
          </div>
          <small class="form-text text-muted err-message" v-show="errors.has('to-address')">{{ errors.first('to-address') }}</small>
        </div>

        <div class="form-group">
          <div class="input-group withdrawal-input-num">
            <div class="input-group-addon"><i class="fa fa-btc" aria-hidden="true"></i></div>
            <input v-model="amount"
                   v-validate data-vv-rules="required|decimal:8" data-vv-as="amount"
                   :class="{'input': true, 'is-danger': errors.has('amount') }"
                   type="text" class="form-control" name="amount" placeholder="Amount">
          </div>
          <small class="form-text text-muted err-message" v-show="errors.has('amount')">{{ errors.first('amount') }}</small>
        </div>

        <button class="btn btn-outline-success btn-submit">Withdraw</button>
      </form>
    </div>
  </div>
</template>

<script>
  import Profile from './Profile'
  import ProfileTopNav from './ProfileTopNav'
  import {mapState} from 'vuex'

  export default {
    name: "wallet",
    data() {
      return {
        toAddress: '',
        amount: 0
      }
    },
    created() {
      if (this.accountInfo.address === '') {
        $("#inputPwdModal").modal("show")
      }
    },
    computed: {
      ...mapState({
        user: state => state.AuthUser,
        accountInfo: state => state.BlockChain.AccountInfo,
        userInfo: state => state.BlockChain.UserInfo
      })
    },
    methods: {
      withdrawal() {
        if (this.accountInfo.address === '') {
          $("#inputPwdModal").modal("show")
        } else {
          this.$validator.validateAll().then(result => {
            if (result) {
              const withdrawalData = {
                amount: this.amount,
                toAddress: this.toAddress
              }
              this.$store.dispatch('withdrawal_inBC', withdrawalData).then(response => {
              })
            }
          })
        }
      }
    },
    components: {
      Profile,
      ProfileTopNav
    }
  }
</script>

<style scoped>
  .user-chain-address {
    margin-top: 30px;
  }
  .user-chain-other {
    margin-top: 10px;
  }

  .withdrawal-input-address {
    margin-top: 50px;
  }
  .withdrawal-input-num {
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .btn-submit {
    border-radius: 0;
    width: 120px;
  }

  .err-message {
    color: #ff0264 !important;
  }
</style>
