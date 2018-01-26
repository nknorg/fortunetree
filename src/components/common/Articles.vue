<template>
  <article id="articles">
    <div class="articles-header"><strong>Articles</strong></div>

    <div class="article-container" v-for="(article,index) in articleList">
      <div class="article-header">
        <span>
          <img class="article-avatar" :src="demoAvatar">
        </span>
        <span class="article-author"><router-link to="">{{article.author}}</router-link></span>
        <span class="article-honor">
          <i class="fa fa-trophy" aria-hidden="true"></i>
          {{(article.honorVal == null ) ? 0 : article.honorVal}}
        </span>
        <span class="article-time">{{article.created_at}}</span>
      </div>

      <div class="article-content">
        <div class="article-first-img">
          <img :src="article.first_img_url">
        </div>
        <div class="article-content-block">
          <div class="article-title">
            <h2>
              <router-link :to="{name: 'Posts', params: {id:article.id}}">{{article.title}}</router-link>
            </h2>
          </div>
          <div class="article-body">
            <router-link :to="{name: 'Posts', params: {id:article.id}}">{{filterContent(article.content)}}</router-link>
          </div>
        </div>
      </div>

      <div class="article-footer">
        <span class="article-star">
          <a @click="userLike(index)">
            <i class="fa" :class="[article.myStar?'fa-thumbs-up':'fa-thumbs-o-up']" aria-hidden="true"></i>
            {{article.starCount}}
          </a>
        </span>
        <span class="article-hate">
          <a @click="userHate(index)">
            <i class="fa" :class="[article.myHate?'fa-thumbs-down':'fa-thumbs-o-down']" aria-hidden="true"></i>
            {{article.hateCount}}
          </a>
        </span>
        <span class="article-comment">
          <router-link :to="{name: 'Posts', params: {id:article.id}}">
            <i class="fa" :class="[article.myComment?'fa-comment':'fa-comment-o']" aria-hidden="true"></i>
            {{article.commentCount}}
          </router-link>
        </span>
      </div>
    </div>
  </article>
</template>

<script>
	export default {
    name: "articles",
    props: ['articleList'],
    data() {
      return {
        demoAvatar: require('../../assets/img/avatar.png'),
        articleObj: {myStar: false, myHate: false, starCount: 0, hateCount: 0}
      }
    },
    methods: {
      userLike(index) {
        if (this.$store.state.BlockChain.AccountInfo.address === '') {
          $("#inputPwdModal").modal("show")
        } else {
          if (this.articleList[index].myStar !== true) {
            this.articleObj = this.articleList[index]
            this.articleObj.myStar = true
            this.articleObj.starCount++
            this.$set(this.articleList, index, this.articleObj);

            let formData = {
              articleId: this.articleList[index].id
            }
            this.$store.dispatch('userLike', formData).then(response => {
              if (response && this.articleList[index].txid !== null) {
                let likeData = {
                  txid: this.articleList[index].txid
                }
                this.$store.dispatch('likeArticle_inBC', likeData)
              }
            })
          }
        }
      },
      userHate(index) {
        if (this.$store.state.BlockChain.AccountInfo.address === '') {
          $("#inputPwdModal").modal("show")
        } else {
          if (this.articleList[index].myHate !== true) {
            this.articleObj = this.articleList[index]
            this.articleObj.myHate = true
            this.articleObj.hateCount++
            this.$set(this.articleList, index, this.articleObj);

            let formData = {
              articleId: this.articleList[index].id
            }
            this.$store.dispatch('userHate', formData).then(response => {
              if (response && this.articleList[index].txid !== null) {
                let hateData = {
                  txid: this.articleList[index].txid
                }
                this.$store.dispatch('hateArticle_inBC', hateData)
              }
            })
          }
        }
      },
      filterContent($content) {
        let start = $content.indexOf('![')
        let end = $content.indexOf(')')

        if (start !== -1 && end !== -1 && start < end) {
          $content = $content.substr(end + 1)
        }

        return $content.substr(0, 200) + ' ...'
      }
    }
  }
</script>

<style scoped>
  #articles {
    background-color: white;
    border: 1px solid #eee;
    padding: 1.5em 2em;
    margin-bottom: 1em;
    box-shadow: 5px 5px 0 0 #253A7E;
  }

  #articles:hover {
    background-color: white;
    box-shadow: 6px 6px 0 0 #253A7E;
  }

  .articles-header {
    margin-bottom: 10px;
  }

  .article-container {
    list-style-type: none;
    margin-left: 0;
    margin-bottom: 40px;
    border: 1px solid #eee;
  }

  .article-header {
    padding: 10px 16px 10px;
    border-bottom: 1px solid #eee;
  }
  .article-avatar {
    height: 50px;
    width: 50px;
    border-radius: 50%;
  }
  .article-author {
    margin-left: 10px;
    line-height: 50px;
    font-size: 16px;
    font-size: 1rem;
  }
  .article-author > a{
    text-decoration: none;
    color: #333;
    font-weight: bold;
  }
  .article-honor {
    margin-left: 15px;
  }
  .article-time {
    margin-left: 15px;
    font-weight: normal;
    font-size: 14px;
    font-size: 0.875rem;
    color: #788187;
  }
  .article-first-img {
    margin-bottom: 16px;
  }
  .article-first-img > img {
    max-width: 100%;
  }

  .article-content-block {
    padding-left: 1.1em;
    padding-right: 1.1em;
    margin-bottom: 16px;
  }
  .article-title > h2 {
    font-size: 18px;
    font-size: 1.125rem;
  }
  .article-title a {
    text-decoration: none;
    color: #333;
  }
  .article-body {
    width: auto;
    padding: 0.3rem 0.1rem 0.15rem;
    overflow: hidden;
    line-height: 1.4;
    text-overflow: ellipsis;
  }
  .article-body > a {
    text-decoration: none;
    color: #333;
  }
  .article-body > a:hover {
    outline-width: 0;
  }

  .article-footer {
    border-top: 1px solid #eee;
    padding: 16px;
    font-size: 15px;
    font-size: 0.9375rem;
    color: #333;
    font-family: "Source Sans Pro", sans-serif;
  }
  .article-footer a {
    text-decoration: none;
    color: #333;
  }
  .article-star {
    border-right: 1px solid #eee;
    padding-right: 16px;
  }
  .article-star > a {
    cursor: pointer;
  }
  .article-hate {
    margin-left: 16px;
    border-right: 1px solid #eee;
    padding-right: 16px;
  }
  .article-hate > a {
    cursor: pointer;
  }
  .article-comment {
    margin-left: 16px;
  }
</style>
