<template>
  <div class="settings">
    <profile></profile>
    <profile-top-nav></profile-top-nav>

    <div class="container">

      <div class="input-group" style="margin: 50px 0 10px;">
        <div class="input-group-addon"><i class="fa fa-user-o" aria-hidden="true"></i></div>
        <input v-model="user.name" type="text" class="form-control" disabled name="name" placeholder="Enter nickname">
      </div>
      <div class="input-group">
        <div class="input-group-addon"><i class="fa fa-envelope-o" aria-hidden="true"></i></div>
        <input v-model="user.email" type="email" class="form-control" disabled name="email" placeholder="Enter email">
      </div>

    </div>
  </div>
</template>

<script>
  import Profile from './Profile'
  import ProfileTopNav from './ProfileTopNav'
  import {mapState} from 'vuex'

  export default {
    name: "settings",
    created() {
      this.$store.dispatch('setAuthUser')
    },
    computed: {
      ...mapState({
        user: state => state.AuthUser
      })
    },
    components: {
      Profile,
      ProfileTopNav
    }
  }
</script>

<style scoped>

</style>
