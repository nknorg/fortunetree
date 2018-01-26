<template>
  <div class="comments">
    <profile></profile>
    <profile-top-nav></profile-top-nav>

    <div class="container comments-body">
      <comment-my-list :commentList="myComments['data']"></comment-my-list>
    </div>
  </div>
</template>

<script>
  import Profile from './Profile'
  import ProfileTopNav from './ProfileTopNav'
  import CommentMyList from './CommentMyList'
  import {mapState} from 'vuex'

  export default {
		name: "comments",
    created() {
      this.$store.dispatch('myCommentList')
    },
    computed: {
      ...mapState({
        myComments: state => state.Comment.myComments
      })
    },
    components: {
      Profile,
      ProfileTopNav,
      CommentMyList
    }
	}
</script>

<style scoped>
  .comments-body {
    margin-top: 30px;
  }
</style>
