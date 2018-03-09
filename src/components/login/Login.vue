<template>
  <div class="container-fluid container-login">
    <div class="row justify-content-center">
      <div class="col-lg-8 col-md-9 col-sm-10 col-xs-12">
        <form @submit.prevent="submitLogin">
          <fieldset>
            <legend class="register-title">Login</legend>

            <div class="form-group">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text"><i class="fa fa-user-o" aria-hidden="true"></i></span>
                </div>
                <input v-model="username"
                       v-validate data-vv-rules="required|min:4" data-vv-as="nickname or email"
                       :class="{'input': true, 'is-danger': errors.has('name') }"
                       type="text" class="form-control" name="name" placeholder="Enter nickname or email">
              </div>
              <small class="form-text text-muted err-message" v-show="errors.has('name')">{{ errors.first('name') }}</small>
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
            </div>
          </fieldset>
          <button class="btn btn-outline-success btn-submit">Login</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "login",
    data() {
      return {
        username: '',
        password: '',
        isShowPassword: false
      }
    },
    created() {
      this.fetchData()
    },
    watch: {
      '$route': 'fetchData'
    },
    methods: {
      viewPassword() {
        this.isShowPassword = !this.isShowPassword
      },
      submitLogin() {
        this.$store.dispatch('hideNotification')

        this.$validator.validateAll().then(result => {
          if (result) {
            let formData = {
              username: this.username,
              password: this.password
            }
            this.$store.dispatch('loginRequest', formData).then(response => {
              if (response !== false) {
                this.$store.dispatch('generateAccountInfo', formData.password)
                this.$router.push({name: 'Home'})
              }
            })
          }
        })
      },
      fetchData() {
        this.username = this.$route.params.username
        if (typeof(this.username) !== 'undefined') {
          this.$store.dispatch('showNotification', {
            level: 'info',
            msg: 'Verification email has been sent to your email.'
          })
        }
      }
    }
  }
</script>

<style scoped>
  .container-login {
    margin-top: 10%;
  }

  .register-title {
    margin: 30px 0;
  }

  .btn-submit {
    border-radius: 0;
    width: 120px;
  }

  .err-message {
    color: #ff0264 !important;
  }
</style>
