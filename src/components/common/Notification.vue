<template>
  <div class="container">
    <div class="notification">
      <div class="alert alert-dismissible" :class="notificationLevel"
           v-if="msg" @click="hideNotification">
        <button type="button" class="close btn-close-notification" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
        <p class="mb-0">{{ msg }}</p>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState, mapActions} from 'vuex'

	export default {
    name: "notification",
    computed: {
      ...mapState({
        level: state => state.Notification.level,
        msg: state => state.Notification.msg
      }),
      notificationLevel() {
        return 'alert-' + this.level
      }
    },
    methods: {
      ...mapActions([
        'hideNotification'
      ])
    }
  }
</script>

<style>
  .btn-close-notification {
    line-height: 22px;
    margin-top: -2px;
  }
</style>
