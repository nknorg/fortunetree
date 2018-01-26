<template>
  <div class="blog">
    <profile></profile>
    <profile-top-nav></profile-top-nav>

    <div class="container blog-body">
      <articles :articleList="blogList['data']"></articles>
    </div>
  </div>
</template>

<script>
  import Profile from './Profile'
  import ProfileTopNav from './ProfileTopNav'
  import Articles from './../common/Articles'
  import {mapState} from 'vuex'

  export default {
    name: "blog",
    created() {
      this.$store.dispatch('myPostList')
    },
    computed: {
      ...mapState({
        blogList: state => state.Post.myBlogList
      })
    },
    components: {
      Profile,
      ProfileTopNav,
      Articles
    }
  }
</script>

<style scoped>
  .blog-body {
    margin-top: 30px;
  }
</style>
