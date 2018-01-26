<template>
  <div class="nav container-fluid profile-top-nav">
    <ul class="container nav nav-tabs">
      <li class="nav-item">
        <a @click.prevent="toMyBlog"
           :class="[(this.$route.name==='Blog') ? 'active' : '']"
           class="nav-link" data-toggle="tab" href="#">Articles</a>
      </li>
      <li class="nav-item">
        <a @click.prevent="toMyComments"
           :class="[(this.$route.name==='Comments') ? 'active' : '']"
           class="nav-link" data-toggle="tab" href="#">Comments</a>
      </li>
      <li class="nav-item">
        <a @click.prevent="toMySettings"
           :class="[(this.$route.name==='Settings') ? 'active' : '']"
           class="nav-link" data-toggle="tab" href="#">Settings</a>
      </li>
      <li class="nav-item">
        <a @click.prevent="toMyWallet"
           :class="[(this.$route.name==='Wallet') ? 'active' : '']"
           class="nav-link" data-toggle="tab" href="#">Wallet</a>
      </li>
    </ul>
  </div>
</template>

<script>
	export default {
    name: "profile-top-nav",
    methods: {
      toMyBlog() {
        this.$router.push({name: 'Blog'})
      },
      toMyComments() {
        this.$router.push({name: 'Comments'})
      },
      toMySettings() {
        this.$router.push({name: 'Settings'})
      },
      toMyWallet() {
        this.$router.push({name: 'Wallet'})
      }
    }
  }
</script>

<style scoped>
  .container-fluid {
    padding: 0;
  }
  .profile-top-nav {
    background-color: #2d3a44;
  }

  /* 自定义 nav table */
  .nav {
    font-size: 1em;
    font-weight: 100;
  }
  .nav-tabs {
    border-bottom: 0;
  }
  .nav-tabs a {
    color: white;
  }
  .nav-item {
    margin: 0;
  }
  .nav-tabs,
  .nav-link {
    border: 0;
    border-radius: 0;
  }
</style>
