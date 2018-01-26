<template>
  <div class="container">
    <div class="row">
      <div class="col-lg-3">
        <tag-list :tags="tagList"></tag-list>
      </div>
      <div class="col-lg-9">
        <articles :articleList="blogList['data']"></articles>
      </div>
    </div>
  </div>
</template>

<script>
  import TagList from '../home/TagList'
  import Articles from './../common/Articles'
  import {mapState} from 'vuex'

  export default {
    name: 'Home',
    created() {
      this.getBlog()
    },
    watch: {
      '$route': 'getBlog'
    },
    computed: {
      ...mapState({
        blogList: state => state.Post.blogList,
        user: state => state.AuthUser,
        tagList: state => state.Tags.tagList
      })
    },
    methods: {
      getBlog() {
        this.$store.dispatch('getTags')

        if (this.$route.params.name === 'new') {
          this.$store.dispatch('newPostList')
        } else if (this.$route.params.name === 'hot') {
          this.$store.dispatch('hotPostList')
        } else if (typeof(this.$route.params.name) !== 'undefined') {
          this.$store.dispatch('tagPostList', this.$route.params.name)
        } else {
          this.$store.dispatch('normalPostList')
        }
      }
    },
    components: {
      TagList,
      Articles
    }
  }
</script>

<style>

</style>
