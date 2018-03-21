<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-lg-1"></div>
      <div class="col-lg-10 col-md-12 comment-input-body">
        <div class="row comment-input-area">
          <textarea v-model="commentInput" rows="3" :placeholder="$t('comment.reply')"></textarea>
        </div>
        <div class="row">
          <button v-bind:disabled="disabledVal"
                  :class="[disabledVal ? 'btn-secondary' : 'btn-outline-success']"
                  @click="userComment"
                  class="btn btn-submit-post">Post</button>
          <button class="btn btn-outline-success btn-cancel-comment" @click="showCommentArea">Cancel</button>
        </div>
      </div>
      <div class="col-lg-1"></div>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'

	export default {
    name: "comment",
    data() {
      return {
        commentInput: '',
        disabledVal: true
      }
    },
    watch: {
      commentInput: 'disabledCancelBtn'
    },
    computed: {
      ...mapState({
        user: state => state.AuthUser,
        blog: state => state.Post.blog
      })
    },
    methods: {
      userComment() {
        if (this.user.authenticated) {
          if (this.$store.state.BlockChain.AccountInfo.address === '') {
            $("#inputPwdModal").modal("show")
          } else {
            let formData = {
              articleId: this.$route.params.id,
              content: this.commentInput
            }
            this.$store.dispatch('postComment', formData).then(response => {
              if (response) {
                const replyData = {
                  txid: this.blog[0].txid,
                  commentContent: this.commentInput
                }
                this.$store.dispatch('replyArticle_inBC', replyData)
              }
            })
          }
        } else {
          this.$router.push({name: 'Login'})
        }
      },
      disabledCancelBtn() {
        this.disabledVal = (this.commentInput === '');
      },
      showCommentArea() {
        this.$store.dispatch('showCommentArea')
      }
    }
  }
</script>

<style scoped>
  .comment-input-body {
    margin: 0 auto;
    max-width: 50rem;
  }
  .comment-input-area > textarea {
    display: block;
    box-sizing: border-box;
    width: 100%;
    margin: 0 0 1rem;
    padding: 0.5rem;
    border: 1px solid #cacaca;
    border-radius: 3px;
    background-color: #fefefe;
    box-shadow: inset 0 1px 2px rgba(51, 51, 51, 0.1);
    font-family: inherit;
    font-size: 1rem;
    font-weight: normal;
    color: #333333;
    transition: box-shadow 0.5s, border-color 0.25s ease-in-out;
    -webkit-appearance: none;
  }

  .btn-submit-post {
    border-radius: 0;
    width: 120px;
    margin-bottom: 1em;
  }

  .btn-cancel-comment {
    border-radius: 0 !important;
    border: 0 !important;
    box-shadow: none !important;
    width: 120px;
    margin-bottom: 1em;
    color: #788187;
  }
  .btn-cancel-comment:hover,
  .btn-cancel-comment:active {
    border-radius: 0 !important;
    border: 0 !important;
    box-shadow: none !important;
    width: 120px;
    margin-bottom: 1em;
    color: #253A7E !important;
    background-color: white !important;
  }
</style>
