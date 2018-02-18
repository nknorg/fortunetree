<template>
  <div class="container-fluid blog-content-all">
    <div class="row blog-content">
      <div class="col-lg-1 "></div>
      <div class="col-lg-10 col-md-12">
        <article class="post-full" v-if="blog != null">
          <div class="post-full-header">
            <h1 class="">{{blog.title}}</h1>

            <div class="post-article-header">
              <span>
                <img class="post-article-avatar" :src="demoAvatar">
              </span>
              <span class="post-article-author"><router-link to="">{{blog.author}}</router-link></span>
              <span class="post-article-honor">
                <i class="fa fa-trophy" aria-hidden="true"></i>
                {{(blog.honorVal == null ) ? 0 : blog.honorVal}}
              </span>
              <span class="post-article-time">{{blog.created_at}}</span>
            </div>
          </div>

          <div class="post-full-body">
            <div v-html="blog.content_html"></div>
          </div>

          <div>
            <span class="tag_list" v-for="tagItem in JSON.parse(blog.tag)">
              <router-link class="btn" :to="{name: 'Articles', params: {name:tagItem}}">{{tagItem}}</router-link>
            </span>
          </div>

          <div class="post-article-footer">
            <span class="post-article-footer-time">
              <i class="fa fa-clock-o" aria-hidden="true"></i>
              {{blog.created_at}}
            </span>
            <span class="post-article-star">
              <a @click="userLike">
                <i class="fa" :class="[blog.myStar?'fa-thumbs-up':'fa-thumbs-o-up']" aria-hidden="true"></i>
              </a>
              <li class="dropdown likes-dropdown">
                <a class="likes-detail dropdown-toggle" @click="userLikeAndHate" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><span class="caret"></span>
                  {{blog.starCount}}
                </a>
                <ul class="dropdown-menu dropdown-menu-likes">
                  <li v-for="liker in likes" v-if="liker.LikeType === 0"><a>{{liker.Liker}}</a></li>
                </ul>
              </li>
            </span>
            <span class="post-article-hate">
              <a @click="userHate">
                <i class="fa" :class="[blog.myHate?'fa-thumbs-down':'fa-thumbs-o-down']" aria-hidden="true"></i>
              </a>
              <li class="dropdown likes-dropdown">
                <a class="likes-detail dropdown-toggle" @click="userLikeAndHate" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><span class="caret"></span>
                  {{blog.hateCount}}
                </a>
                <ul class="dropdown-menu dropdown-menu-likes">
                  <li v-for="liker in likes" v-if="liker.LikeType === 1"><a>{{liker.Liker}}</a></li>
                </ul>
              </li>
            </span>
            <span class="post-article-comment">
              <router-link to="">
                <i class="fa" :class="[blog.myComment?'fa-comment':'fa-comment-o']" aria-hidden="true"></i>
                {{blog.commentCount}}
              </router-link>
            </span>
            <span class="post-article-reply">
              <a @click="showCommentArea" class="btn">Reply</a>
            </span>
          </div>
        </article>
      </div>
      <div class="col-lg-1"></div>
    </div>

    <comment v-show="replyView"></comment>

    <comment-list :commentList="commentList"></comment-list>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import Comment from './../common/Comment'
  import CommentList from './../posts/CommentList'

	export default {
    name: "post",
    mounted() {
      this.getBlog()
    },
    watch: {
      '$route': 'getBlog'
    },
    computed: {
      ...mapState({
        user: state => state.AuthUser,
        blog: state => state.Post.blog[0],
        commentList: state => state.Comment.commentList,
        replyView: state => state.Comment.viewComment
      })
    },
    data() {
      return {
        demoAvatar: require('../../assets/img/avatar.png'),
        blogObj: {myStar: false, starCount: 0},
        likes: [{Liker: '', LikeType: 0}]
      }
    },
    methods: {
      getBlog() {
        this.$store.dispatch('oneBlog', this.$route.params.id)
        this.$store.dispatch('getComment', this.$route.params.id)
      },
      isLogin() {
        if (this.user.authenticated) {
          if (this.$store.state.BlockChain.AccountInfo.address === '') {
            $("#inputPwdModal").modal("show")
          } else {
            return true
          }
        } else {
          this.$router.push({name: 'Login'})
        }
      },
      userLike() {
        if (typeof(this.blog.myStar) === 'undefined' || this.blog.myStar !== true) {
          if (this.isLogin() === true) {
            this.blogObj = this.blog
            this.blogObj.myStar = true
            this.blogObj.starCount++
            this.$set(this.blog, 0, this.blogObj);

            let formData = {
              articleId: this.$route.params.id
            }
            this.$store.dispatch('userLike', formData).then(response => {
              if (response && this.blog.txid !== null) {
                let likeData = {
                  txid: this.blog.txid
                }
                this.$store.dispatch('likeArticle_inBC', likeData)
              }
            })
          }
        }
      },
      userHate() {
        if (typeof(this.blog.myHate) === 'undefined' || this.blog.myHate !== true) {
          if (this.isLogin() === true) {
            this.articleObj = this.blog
            this.articleObj.myHate = true
            this.articleObj.hateCount++
            this.$set(this.blog, 0, this.articleObj);

            let formData = {
              articleId: this.$route.params.id
            }
            this.$store.dispatch('userHate', formData).then(response => {
              if (response && this.blog.txid !== null) {
                let hateData = {
                  txid: this.blog.txid
                }
                this.$store.dispatch('hateArticle_inBC', hateData)
              }
            })
          }
        }
      },
      userLikeAndHate() {
        if(this.likes[0].Liker === ''){
          this.$store.dispatch('getLikeAndHateList_inBC', this.blog.txid).then(response => {
            this.likes = response;
          })
        }
      },
      showCommentArea() {
        this.$store.dispatch('showCommentArea')
      }
    },
    components: {
      Comment,
      CommentList
    }
  }
</script>

<style>
  .blog-content-all {
    background-color: white;
  }
  .blog-content img {
    max-width: 100%;
    text-align: center;
    margin:0 auto;
  }

  .post-full {
    margin: 20px auto 60px;
    border-bottom: 1px solid #eee;
    max-width: 50rem;
  }

  .post-full-header {
    border-bottom: 1px solid #eee;
    max-width: 50rem;
    margin: 0 auto;
  }
  .post-full-header > h1 {
    overflow: hidden;
    font-family: "Source Sans Pro", "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 200%;
    line-height: 1.1;
  }
  .post-article-header {
    padding: 10px 16px 10px 0;
  }
  .post-article-avatar {
    height: 50px;
    width: 50px;
    border-radius: 50%;
  }
  .post-article-author {
    margin-left: 10px;
    line-height: 50px;
    font-size: 16px;
    font-size: 1rem;
  }
  .post-article-author > a{
    text-decoration: none;
    color: #333;
    font-weight: bold;
  }
  .post-article-honor {
    margin-left: 10px;
  }
  .post-article-time {
    margin-left: 10px;
    font-weight: normal;
    font-size: 14px;
    font-size: 0.875rem;
    color: #788187;
  }

  .post-full-body {
    margin: 20px 0;
  }

  .tag_list {
    margin-bottom: 0.5rem;
  }
  .tag_list > a {
    background: #fcfcfc;
    color: #333;
    border: 1px solid #eee;
    display: inline-block;
    margin: 0.1rem 0.4rem 0.1rem 0;
    padding: 0.2rem 0.5rem;
    border-radius: 0.3rem;
    transition: 0.2s all ease-in-out;
  }
  .tag_list > a:hover,
  .tag_list > a:active {
    background: #fcfcfc;
    color: #333;
    border: 1px solid #000;
  }

  .post-article-footer {
    padding: 16px 1px 16px 1px;
    font-size: 15px;
    font-size: 0.9375rem;
    color: #333;
    font-family: "Source Sans Pro", sans-serif;
  }
  .post-article-footer a {
    text-decoration: none;
    color: #333;
  }
  .post-article-star,
  .post-article-hate,
  .post-article-comment {
    border-left: 1px solid #eee;
    padding: 0 16px;
  }
  .post-article-star > a,
  .post-article-hate > a,
  .likes-dropdown {
    cursor: pointer;
  }
  .likes-dropdown {
    list-style-type: none;
    display: inline;
  }
  .likes-detail {
    margin-left: 5px;
  }
  .dropdown-menu-likes {
    border-radius: 3px;
    padding: 6px 8px;
    background-color: #fcfcfc;
    border: 1px solid #788187;
    transition: all 0.3s ease 0s, visibility 0s linear 0.3s;
    box-shadow: 1px 1px 5px 0 rgba(50, 50, 50, 0.75);
  }
  .post-article-footer-time {
    margin-right: 16px;
  }

  .post-article-reply > a {
    float: right;
    background: #fcfcfc;
    color: #788187 !important;
    border: 1px solid #788187;
    display: inline-block;
    /*margin: 0 auto;*/
    padding: 0.1rem 1rem;
    border-radius: 0.2rem;
    transition: 0.2s all ease-in-out;
    cursor: pointer;
  }
  .post-article-reply > a:hover {
    color: #253A7E !important;
    border: 1px solid #253A7E;
  }
</style>
