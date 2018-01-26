<template>
  <article id="comment-lists">
    <div class="comment-list-container" v-for="(commentItem,index) in commentList">
      <div class="comment-list-header">
        <span>
          <img class="comment-list-avatar" :src="demoAvatar">
        </span>
        <span class="comment-list-author"><router-link to="">{{commentItem.author}}</router-link></span>
        <span class="comment-list-honor">
          <i class="fa fa-trophy" aria-hidden="true"></i>
          {{(commentItem.honorVal == null ) ? 0 : 'commentItem.honorVal'}}
        </span>
        <span class="comment-list-time">{{commentItem.created_at}}</span>
      </div>

      <div class="comment-list-content">
        <div class="comment-list-content-block">
          <div class="comment-list-title">
            <h2>
              <router-link :to="{name: 'Posts', params: {id:commentItem.article_id}}">{{commentItem.title}}</router-link>
            </h2>
          </div>
          <div class="comment-list-body">
            <router-link :to="{name: 'Posts', params: {id:commentItem.article_id}}">{{commentItem.content}}</router-link>
          </div>
        </div>
      </div>

      <div class="comment-list-footer">
        <span class="comment-list-star">
          <a @click="userLike(index)">
            <i class="fa" :class="[commentItem.myStar?'fa-thumbs-up':'fa-thumbs-o-up']" aria-hidden="true"></i>
            {{commentItem.starCount}}
          </a>
        </span>
        <span class="comment-list-comment">
          <router-link :to="{name: 'Posts', params: {id:commentItem.article_id}}">
            <i class="fa" :class="[commentItem.myComment?'fa-comment':'fa-comment-o']" aria-hidden="true"></i>
            {{commentItem.commentCount}}
          </router-link>
        </span>
      </div>
    </div>
  </article>
</template>

<script>
	export default {
    name: "comment-my-list",
    props: ['commentList'],
    data() {
      return {
        demoAvatar: require('../../assets/img/avatar.png'),
        articleObj: {myStar: false, starCount: 0}
      }
    },
    methods: {
      userLike(index) {
        if (this.commentList[index].myStar !== true) {
          this.articleObj = this.commentList[index]
          this.articleObj.myStar = true
          this.articleObj.starCount++
          this.$set(this.commentList, index, this.articleObj);

          let formData = {
            articleId: this.commentList[index].id
          }
          this.$store.dispatch('userLike', formData)
        }
      }
    }
  }
</script>

<style scoped>
  #comment-lists {
    background-color: white;
    border: 1px solid #eee;
    padding: 1.5em 2em;
    margin-bottom: 1em;
    box-shadow: 5px 5px 0 0 #253A7E;
  }

  #comment-lists:hover {
    background-color: white;
    box-shadow: 6px 6px 0 0 #253A7E;
  }

  .comment-list-container {
    list-style-type: none;
    margin-left: 0;
    margin-bottom: 40px;
    border: 1px solid #eee;
  }

  .comment-list-header {
    padding: 10px 16px 10px;
    border-bottom: 1px solid #eee;
  }
  .comment-list-avatar {
    height: 50px;
    width: 50px;
    border-radius: 50%;
  }
  .comment-list-author {
    margin-left: 10px;
    line-height: 50px;
    font-size: 16px;
    font-size: 1rem;
  }
  .comment-list-author > a{
    text-decoration: none;
    color: #333;
    font-weight: bold;
  }
  .comment-list-honor {
    margin-left: 10px;
    font-weight: 100;
  }
  .comment-list-time {
    margin-left: 10px;
    font-weight: normal;
    font-size: 14px;
    font-size: 0.875rem;
    color: #788187;
  }

  .comment-list-content-block {
    padding-left: 1.1em;
    padding-right: 1.1em;
    margin-top: 16px;
    margin-bottom: 16px;
  }
  .comment-list-title > h2 {
    font-size: 18px;
    font-size: 1.125rem;
  }
  .comment-list-title a {
    text-decoration: none;
    color: #333;
  }
  .comment-list-body {
    width: auto;
    padding: 0.3rem 0.1rem 0.15rem;
    overflow: hidden;
    line-height: 1.4;
    text-overflow: ellipsis;
  }
  .comment-list-body > a {
    text-decoration: none;
    color: #333;
  }
  .comment-list-body > a:hover {
    outline-width: 0;
  }

  .comment-list-footer {
    border-top: 1px solid #eee;
    padding: 16px;
    font-size: 15px;
    font-size: 0.9375rem;
    color: #333;
    font-family: "Source Sans Pro", sans-serif;
  }
  .comment-list-footer a {
    text-decoration: none;
    color: #333;
  }
  .comment-list-star {
    border-right: 1px solid #eee;
    padding-right: 16px;
  }
  .comment-list-star > a {
    cursor: pointer;
  }
  .comment-list-comment {
    margin-left: 16px;
  }
</style>
