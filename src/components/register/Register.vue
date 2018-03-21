<template>
  <div class="container-fluid container-register">
    <div class="row justify-content-center">
      <div class="col-lg-8 col-md-9 col-sm-10 col-xs-12">
        <form @submit.prevent="submitRegister">
          <fieldset>
            <legend class="register-title">{{ $t('register.tit') }}</legend>
            <div class="form-group">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text"><i class="fa fa-user-o" aria-hidden="true"></i></span>
                </div>
                <input v-model="username"
                       v-validate data-vv-rules="required|min:4" data-vv-as="nickname"
                       :class="{'input': true, 'is-danger': errors.has('name') }"
                       type="text" class="form-control" name="name" :placeholder="$t('register.nicknamePlaceholder')">
              </div>
              <small class="form-text text-muted err-message" v-show="errors.has('name')">{{ errors.first('name') }}</small>
            </div>
            <div class="form-group">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text"><i class="fa fa-envelope-o" aria-hidden="true"></i></span>
                </div>
                <input v-model="email"
                       v-validate data-vv-rules="required|email" data-vv-as="email"
                       :class="{'input': true, 'is-danger': errors.has('email') }"
                       type="email" class="form-control" name="email" :placeholder="$t('register.emailPlaceholder')">
              </div>
              <small class="form-text text-muted err-message" v-show="errors.has('email')">{{ errors.first('email') }}</small>
            </div>
            <div class="form-group">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text"><i class="fa fa-key" aria-hidden="true"></i></span>
                </div>
                <input :type="[isShowPassword ? 'text' : 'password']"
                       v-model="password"
                       v-validate data-vv-rules="required|min:6" data-vv-as="password"
                       class="form-control" name="password" :placeholder="$t('register.passwordPlaceholder')">
                <div class="input-group-append" @click="viewPassword">
                  <span class="input-group-text">
                    <i class="fa" :class="[isShowPassword ? 'fa-eye' : 'fa-eye-slash']" aria-hidden="true"></i>
                  </span>
                </div>
              </div>
              <small class="form-text text-muted err-message" v-show="errors.has('password')">{{ errors.first('password') }}</small>
            </div>
          </fieldset>
          <button class="btn btn-outline-success btn-submit">{{ $t('register.submit') }}</button>
        </form>
      </div>
    </div>
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
                            this.$router.push({name: 'Login', params: {username: this.username}})
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
  .container-register {
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
