<template>
  <nav class="navbar navbar-expand-lg navbar-expand-md navbar-expand-sm navbar-expand-xs fixed-top navbar-light bg-light navbar-elevation">

    <router-link class="navbar-brand" :to="{path: '/'}"><img class="navbar-logo" src="./../../assets/logo.png" alt=""></router-link>

    <div class="collapse navbar-collapse" id="navbarColor03">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item" :class="[(this.$route.params.name==='new') ? 'active' : '']">
          <router-link class="nav-link" :to="{name: 'Articles', params: {name:'new'}}">{{ $t('navbar.new') }}</router-link>
        </li>
        <li class="nav-item" :class="[(this.$route.params.name==='hot') ? 'active' : '']">
          <router-link class="nav-link" :to="{name: 'Articles', params: {name:'hot'}}">{{ $t('navbar.hot') }}</router-link>
        </li>

        <!--<li class="nav-item">-->
          <!--<input class="form-control mr-sm-2 nav-search" type="text" placeholder="Search">-->
        <!--</li>-->
      </ul>

      <ul class="navbar-nav">
        <li class="nav-item" v-if="!user.authenticated">
          <a class="nav-link change-locale" @click.prevent="changeLocale">{{ $t('language.name') }}</a>
        </li>

        <li class="nav-item" v-if="!user.authenticated"
            :class="[(this.$route.name==='Register') ? 'active' : '']">
          <router-link class="nav-link" :to="{name: 'Register'}">{{ $t('navbar.signUp') }}</router-link>
        </li>
        <li class="nav-item" v-if="!user.authenticated"
            :class="[(this.$route.name==='Login') ? 'active' : '']">
          <router-link class="nav-link" :to="{name: 'Login'}">{{ $t('navbar.login') }}</router-link>
        </li>
        <li class="post-li" v-if="user.authenticated">
          <router-link class="btn btn-success post-btn" :to="{name: 'Post'}">{{ $t('navbar.post') }}</router-link>
        </li>

        <li class="nav-item dropdown show" v-if="user.authenticated">
          <a class="nav-link" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="true">
            <img class="navbar-avatar" :src="demoAvatar" alt="">
          </a>
          <div class="dropdown-menu" x-placement="bottom-start">
            <a @click.stop.prevent="" class="dropdown-item"><strong>{{user.name}}</strong></a>
            <div class="dropdown-divider"></div>
            <a @click.prevent="toMyBlog" class="dropdown-item" href="#">
              <i class="fa fa-home" aria-hidden="true"></i>
              &nbsp;&nbsp;{{ $t('navbar.articles') }}
            </a>
            <a @click.prevent="toMyComments" class="dropdown-item" href="#">
              <i class="fa fa-comment" aria-hidden="true"></i>
              &nbsp;&nbsp;{{ $t('navbar.comments') }}
            </a>
            <a @click.prevent="toMySettings" class="dropdown-item" href="#">
              <i class="fa fa-cogs" aria-hidden="true"></i>
              &nbsp;&nbsp;{{ $t('navbar.settings') }}
            </a>
            <a @click.prevent="changeLocale" class="dropdown-item" href="#">
              <i class="fa fa-language" aria-hidden="true"></i>
              &nbsp;&nbsp;{{ $t('language.name') }}
            </a>
            <a @click.prevent="toMyWallet" class="dropdown-item" href="#">
              <i class="fa fa-bank" aria-hidden="true"></i>
              &nbsp;&nbsp;{{ $t('navbar.wallet') }}
            </a>
            <div class="dropdown-divider"></div>
            <a @click.prevent="logout" class="dropdown-item" href="#">
              <i class="fa fa-sign-out" aria-hidden="true"></i>
              &nbsp;&nbsp;{{ $t('navbar.logout') }}
            </a>
          </div>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
  import {mapState} from 'vuex'
  import LangStorage from './../../helpers/lang'

  export default {
    name: 'TopNav',
    data() {
      return {
        demoAvatar: require('../../assets/img/avatar.png'),
      }
    },
    computed: {
      ...mapState({
        user: state => state.AuthUser,
        userInfo: state => state.BlockChain.UserInfo
      })
    },
    methods: {
      changeLocale() {
        let locale = this.$i18n.locale
        locale === 'zh' ? this.$i18n.locale = 'en' : this.$i18n.locale = 'zh'
        LangStorage.setLang(this.$i18n.locale)
        this.$validator.localize(this.$i18n.locale)
      },
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
      },
      logout() {
        this.$store.dispatch('logoutRequest').then(response => {
          this.$router.push({name: 'Home'})
        })
      }
    }
  }
</script>

<style>
  .navbar-logo {
    height: 53px;
    margin-right: 5px;
    padding-bottom: 3px;
  }

  .navbar-elevation {
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.05);
  }

  .nav-item {
    margin-left: 10px;
  }

  .nav-search {
    margin-left: 40px;
    border-radius: 0;
    border: 0;
  }

  .change-locale:hover {
    cursor: pointer;
  }

  .post-btn {
    margin-top: 7px;
    border-radius: 0;
    border: 0;
    font-size: 1.0rem;
    width: 88px;
    height: 40px;
  }

  .post-li {
    margin-left: 15px;
  }
  .post-li > a:link,
  .post-li > a:visited {
    background-color: #bb412c;
    box-shadow: 0 0 0 0 transparent, 4px 4px 0 0 #253A7E;
    color: #fcfcfc;
  }
  .post-li > a:hover {
    background-color: #253A7E;
    box-shadow: 2px 2px 2px 0 rgba(0, 0, 0, 0.1), 5px 5px 0 0 #bb412c;
    color: #fff;
    text-shadow: 0 1px 0 rgba(0, 0, 0, 0.2);
  }
  .post-li > a:active {
    background-color: #253A7E !important;
    box-shadow: 2px 2px 2px 0 rgba(0, 0, 0, 0.1), 5px 5px 0 0 #bb412c !important;
    color: #fff !important;
    text-shadow: 0 1px 0 rgba(0, 0, 0, 0.2) !important;
  }
  .post-li > a:not([href]):not([tabindex]) {
    color: white;
  }

  .navbar-avatar {
    height: 40px;
    width: 40px;
    border-radius: 50%;
    margin-left: 20px;
  }

  .navbar {
    font-size: 1.1em;
  }

  .fa {
    width: 18px;
  }

  .dropdown-menu {
    position: absolute;
    transform: translate3d(-85px, 55px, 0px);
    top: 0;
    left: 0;
    will-change: transform;
  }

  .nav-item > input::-webkit-input-placeholder { color:#cacaca; }
  .nav-item > input::-moz-placeholder { color:#cacaca; } /* firefox 19+ */
  .nav-item > input:-ms-input-placeholder { color:#cacaca; } /* ie */
  .nav-item > input:-moz-placeholder { color:#cacaca; }
</style>
