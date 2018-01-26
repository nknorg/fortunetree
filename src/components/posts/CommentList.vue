<template>
  <div class="container-fluid">
    <div class="row comment-for" v-for="commentItem in commentList">
      <div class="col-lg-1"></div>
      <div class="col-lg-10 col-md-12 comment-body">
        <div class="row">
          <div class="col-lg-1" style="padding-left: 0;">
            <img class="comment-avatar" :src="demoAvatar">
          </div>

          <div class="col-lg-11">
            <div class="row">
              <span class="comment-author">
                <router-link to="">{{commentItem.author}}</router-link>
              </span>
              <span class="comment-time">{{commentItem.created_at}}</span>
            </div>
            <div class="row">
              <div class="comment-content">
                {{commentItem.content}}
              </div>
            </div>
            <div class="row comment-footer">
              <span class="comment-star">
                <a @click="userLike(index)">
                  <i class="fa" :class="[commentItem.myStar?'fa-thumbs-up':'fa-thumbs-o-up']" aria-hidden="true"></i>
                  {{commentItem.starCount > 0 ? commentItem.starCount : 0}}
                </a>
              </span>
              <span class="comment-comment">
                <router-link :to="{name: 'Posts', params: {id:commentItem.id}}">
                  <i class="fa" :class="[commentItem.myComment?'fa-comment':'fa-comment-o']" aria-hidden="true"></i>
                  {{commentItem.commentCount > 0 ? commentItem.commentCount : 0}}
                </router-link>
              </span>
              <span class="comment-reply">
                <a @click="">
                  Reply
                </a>
              </span>
            </div>
          </div>

        </div>
      </div>
      <div class="col-lg-1"></div>
    </div>
  </div>
</template>

<script>
	export default {
		name: "comment-list",
    props: ['commentList'],
    data() {
      return {
        demoAvatar: require('../../assets/img/avatar.png')
      }
    }
	}
</script>

<style scoped>
  .comment-for {
    margin-top: 5px;
    margin-bottom: 30px;
  }

  .comment-body {
    margin: 0 auto;
    max-width: 50rem;
  }

  .comment-avatar {
    height: 50px;
    width: 50px;
    border-radius: 50%;
  }

  .comment-author {
    font-size: 16px;
    font-size: 1rem;
    line-height: 24px;
  }
  .comment-author > a{
    text-decoration: none;
    color: #333;
    font-weight: bold;
  }

  .comment-time {
    margin-left: 10px;
    font-size: 14px;
    font-size: 0.875rem;
    color: #788187;
    line-height: 24px;
  }

  .comment-footer {
    font-size: 15px;
    font-size: 0.9375rem;
    color: #333;
    font-family: "Source Sans Pro", sans-serif;
  }
  .comment-footer a {
    text-decoration: none;
    color: #333;
  }
  .comment-star {
    border-right: 1px solid #eee;
    padding-right: 16px;
  }
  .comment-star > a {
    cursor: pointer;
  }
  .comment-comment {
    margin-left: 16px;
    border-right: 1px solid #eee;
    padding-right: 16px;
  }
  .comment-reply {
    margin-left: 16px;
  }
  .comment-reply > a {
    cursor: pointer;
  }
  .comment-reply > a:hover{
    color: #253A7E;
  }
</style>
