<template>
  <div>
    <top-nav></top-nav>
    <div class="container-div"></div>
    <notification></notification>
    <router-view></router-view>
    <input-pwd-modal></input-pwd-modal>
  </div>
</template>

<script>
  import TopNav from './common/TopNav'
  import Notification from './common/Notification'
  import InputPwdModal from './modals/InputPwd'
  import jwtToken from './../helpers/jwt'
  import Cookie from 'js-cookie'
  import {mapActions} from 'vuex'

  export default {
    name: 'app',
    watch: {
      '$route': 'hideNotification'
    },
    methods: {
      ...mapActions([
        'hideNotification'
      ])
    },
    created() {
      if (jwtToken.getToken()) {
        this.$store.dispatch('setAuthUser').then(response => {
          if (response) {
            this.$store.dispatch('getUserInfo_inBC')
          }
        })
      } else if (Cookie.get('auth_id')) {
        this.$store.dispatch('refreshToken')
      }
    },
    components: {
      TopNav,
      Notification,
      InputPwdModal
    }
  }
</script>

<style>
  @import url("https://fonts.googleapis.com/css?family=Montserrat:300,400,500,700,900");

  body {
    font-family: "PingFang SC", Verdana, "Microsoft YaHei", "微软雅黑", sans-serif;
    background-color: #fcfcfc;
  }

  /* top nav height */
  .container-div {
    height: 100px;
  }

  /* normal btn submit */
  .btn-outline-success {
    color: #253A7E;
    border-color: #253A7E;
    box-shadow: none !important;
  }
  .btn-outline-success:hover{
    color: white;
    background-color: #bb412c;
    border-color: #bb412c;
    box-shadow: none !important;
  }
  .btn-outline-success:active {
    color: white !important;
    background-color: #bb412c !important;
    border-color: #bb412c !important;
    box-shadow: none !important;
  }

  /* enter btn disabled style */
  .enter-disabled,
  .enter-disabled:hover,
  .enter-disabled:active {
    color: white !important;
    background-color: #bb412c !important;
    border-color: #bb412c !important;
    box-shadow: none !important;
  }
</style>

