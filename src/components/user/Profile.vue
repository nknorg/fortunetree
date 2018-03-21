<template>
  <div class="container-fluid container-fluid-body">
    <div class="user-profile-banner">
      <div class="user-profile-username">{{user.name}}</div>
      <div class="user-profile-reputation">
        <i class="fa fa-trophy" aria-hidden="true"></i>&nbsp;&nbsp;
        {{userInfo.Reputation}}
      </div>
      <div class="user-profile-join-date">
        <i class="fa fa-calendar-check-o" aria-hidden="true"></i> {{ $t('profile.joined') }}&nbsp;&nbsp;
        {{user.joinDate}}
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'

	export default {
    name: "profile",
    created() {
      this.$store.dispatch('setAuthUser')
      this.$store.dispatch('getUserInfo_inBC')
    },
    computed: {
      ...mapState({
        user: state => state.AuthUser,
        userInfo: state => state.BlockChain.UserInfo
      })
    }
  }
</script>

<style scoped>
  .container-fluid {
    padding: 0;
  }
  .container-fluid-body {
    margin-top: -30px;
  }
  .user-profile-banner {
    background-size: cover;
    background: #253A7E no-repeat 50% 50%;
    text-shadow: 1px 1px 4px black;
    min-height: 155px;
    color: white;
    text-align: center;
    padding: 30px;
  }
  .user-profile-username {
    margin-top: 10px;
    font-size: 1.8em;
  }
  .user-profile-reputation{
    margin-top: 15px;
  }
  .user-profile-join-date {
    font-size: 0.8em;
    font-weight: lighter;
  }
</style>
