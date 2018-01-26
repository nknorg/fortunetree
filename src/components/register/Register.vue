<template>
  <div class="container">
    <form @submit.prevent="submitRegister">
      <fieldset>
        <legend class="register-title">Welcome to FTree</legend>
        <div class="form-group">
          <div class="input-group">
            <div class="input-group-addon"><i class="fa fa-user-o" aria-hidden="true"></i></div>
            <input v-model="username"
                   v-validate data-vv-rules="required|min:4" data-vv-as="nickname"
                   :class="{'input': true, 'is-danger': errors.has('name') }"
                   type="text" class="form-control" name="name" placeholder="Enter nickname">
          </div>
          <small class="form-text text-muted err-message" v-show="errors.has('name')">{{ errors.first('name') }}</small>
        </div>
        <div class="form-group">
          <div class="input-group">
            <div class="input-group-addon"><i class="fa fa-envelope-o" aria-hidden="true"></i></div>
            <input v-model="email"
                   v-validate data-vv-rules="required|email" data-vv-as="email"
                   :class="{'input': true, 'is-danger': errors.has('email') }"
                   type="email" class="form-control" name="email" placeholder="Enter email">
          </div>
          <small class="form-text text-muted err-message" v-show="errors.has('email')">{{ errors.first('email') }}</small>
        </div>
        <div class="form-group">
          <div class="input-group">
            <div class="input-group-addon"><i class="fa fa-key" aria-hidden="true"></i></div>
            <input :type="[isShowPassword ? 'text' : 'password']"
                   v-model="password"
                   v-validate data-vv-rules="required|min:6" data-vv-as="password"
                   class="form-control" name="password" placeholder="Enter password">
            <div class="input-group-addon" @click="viewPassword"><i class="fa" :class="[isShowPassword ? 'fa-eye' : 'fa-eye-slash']" aria-hidden="true"></i></div>
          </div>
          <small class="form-text text-muted err-message" v-show="errors.has('password')">{{ errors.first('password') }}</small>
        </div>
      </fieldset>
      <button class="btn btn-outline-success btn-submit">Submit</button>
    </form>
  </div>
</template>

<script>
	export default {
    name: "register",
    data() {
      return {
        username: '',
        password: '',
        email: '',
        isShowPassword: false
      }
    },
    methods: {
      viewPassword() {
        this.isShowPassword = !this.isShowPassword
      },
      submitRegister() {
        this.$store.dispatch('hideNotification')

        this.$validator.validateAll().then(result => {
          if (result) {
            let formData = {
              name: this.username,
              email: this.email,
              password: this.password
            }
            this.$store.dispatch('verifyName', formData).then(response => {
              if (response) {
                this.$store.dispatch('isAlready_inBC', formData.name).then(response => {
                  if (response) {
                    this.$store.dispatch('userRegister', formData).then(response => {
                      if (response) {
                        this.$store.dispatch('userRegister_inBC', formData).then(response => {
                          if (response === true) {
                            this.$router.push({name: 'Login', params: {username: this.email}})
                          } else {
                            this.$store.dispatch('showNotification', {
                              level: 'danger',
                              msg: 'Code: ' + response.Error + '; Desc: ' + response.Desc + '.'
                            })
                          }
                        })
                      }
                    })
                  }
                })
              }
            })
          }
        })
      }
    }
  }
</script>

<style scoped>
  .register-title {
    margin: 30px 0;
  }
  .input-group-addon {
    width: 50px;
  }

  .btn-submit {
    border-radius: 0;
    width: 120px;
  }

  .err-message {
    color: #ff0264 !important;
  }
</style>
