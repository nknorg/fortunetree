<template>
  <div class="modal modal_wapper fade" id="inputPwdModal">
    <div class="modal-dialog" role="document">
      <div class="modal-content">

        <form @submit.prevent="verifyPwd">
          <div class="modal-header">
            <h5 class="modal-title">Please enter your login password</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          <div class="modal-body">
            <div class="form-group">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text"><i class="fa fa-user-o" aria-hidden="true"></i></span>
                </div>
                <input v-model="user.name" type="text" disabled class="form-control" placeholder="Nickname">
              </div>
            </div>
            <div class="form-group">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text"><i class="fa fa-key" aria-hidden="true"></i></span>
                </div>
                <input :type="[isShowPassword ? 'text' : 'password']"
                       v-model="password"
                       v-validate data-vv-rules="required|min:6" data-vv-as="password"
                       class="form-control" name="password" placeholder="Enter password">
                <div class="input-group-append" @click="viewPassword">
                  <span class="input-group-text">
                    <i class="fa" :class="[isShowPassword ? 'fa-eye' : 'fa-eye-slash']" aria-hidden="true"></i>
                  </span>
                </div>
              </div>
              <small class="form-text text-muted err-message" v-show="errors.has('password')">{{ errors.first('password') }}</small>
              <small class="form-text text-muted err-message" v-show="showPwdErrMsg">{{ pwdErrMsg }}</small>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-outline-success btn-submit"
                    :class="[waitingStatus ? 'disabled enter-disabled':'']">
              {{waitingStatus ? 'Waiting...' : 'Enter'}}</button>
          </div>
        </form>

      </div>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'

  export default {
    name: "input-pwd-modal",
    data() {
      return {
        password: '',
        isShowPassword: false,
        pwdErrMsg: 'Password Error',
        showPwdErrMsg: false,
        waitingStatus: false
      }
    },
    computed: {
      ...mapState({
        user: state => state.AuthUser
      })
    },
    watch: {
      password: function () {
        this.showPwdErrMsg = false
      }
    },
    methods: {
      viewPassword() {
        this.isShowPassword = !this.isShowPassword
      },
      verifyPwd() {
        this.waitingStatus = true
        this.showPwdErrMsg = false

        this.$validator.validateAll().then(result => {
          if (result) {
            let formData = {
              username: this.username,
              password: this.password
            }
            this.$store.dispatch('verifyPassword', formData).then(response => {
              if (response) {
                this.$store.dispatch('generateAccountInfo', formData.password)
                $("#inputPwdModal").modal("hide")

                this.$store.dispatch('getUserInfo_inBC')
              } else {
                this.showPwdErrMsg = true
                this.waitingStatus = false
              }
            })
          }
        })
      }
    }
  }
</script>

<style scoped>
  .modal-dialog {
    -webkit-transform: translate(0, -50%);
    -ms-transform: translate(0, -50%);
    -o-transform: translate(0, -50%);
    transform: translate(0, -50%);
  }
  .modal-dialog {
    position: absolute;
    width: auto;
    margin: 0 auto;
    left: 0;
    right: 0;
    top: 30%;
  }

  /* modal style */
  .modal-dialog {
    background-color: white;
    border: 1px solid #eee;
    padding: 1.5em 0 1em;
    margin-bottom: 1em;
    box-shadow: 5px 5px 0 0 #253A7E;
  }
  .modal-dialog:hover {
    background-color: white;
    box-shadow: 6px 6px 0 0 #253A7E;
  }

  .btn-submit {
    border-radius: 0;
    width: 120px;
  }

  .modal-content {
    border: 0;
  }

  .err-message {
    color: #ff0264 !important;
  }
</style>
