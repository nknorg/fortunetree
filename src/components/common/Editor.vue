<template>
  <form @submit.prevent="submitPost">
    <input v-model="title" type="text" class="form-control post-title" name="title" placeholder="Title">

    <div class="editor-name">Markdown Editor</div>

    <div class="editor-container">
      <div id="editor">
        <textarea :value="input" @input="update" placeholder="Markdown Editor"></textarea>
        <div v-html="compiledMarkdown"></div>
      </div>
    </div>

    <input v-model="tags" type="text" class="form-control post-tags" name="tags" placeholder="Tag (up to 5 tags), the first tag is your main category.">

    <button v-bind:disabled="disabledVal"
            :class="[disabledVal ? 'btn-secondary' : 'btn-outline-success', waitingStatus ? 'disabled enter-disabled':'']"
            class="btn btn-submit-post">{{waitingStatus ? 'Waiting...' : 'Submit'}}</button>
  </form>
</template>

<script>
	export default {
    name: "editor",
    data() {
      return {
        disabledVal: true,
        input: '# Hello',
        title: '',
        tags: '',
        content: '',
        waitingStatus: false
      }
    },
    watch: {
      title: 'disabledBtn',
      input: 'disabledBtn',
      tags: 'disabledBtn'
    },
    computed: {
      compiledMarkdown: function () {
        return marked(this.input, {sanitize: true})
      }
    },
    methods: {
      update: _.debounce(function (e) {
        this.input = e.target.value
      }, 300),
      submitPost() {
        this.waitingStatus = true

        if (this.$store.state.BlockChain.AccountInfo.address === '') {
          $("#inputPwdModal").modal("show")
          this.waitingStatus = false
        } else {
          const formData = {
            title: this.title,
            content: this.input,
            contentHtml: marked(this.input, {sanitize: true}),
            tags: this.tags
          }
          this.$store.dispatch('postRequest', formData).then(response => {
            if (response !== false) {
              this.$router.push({name: 'Blog'})
            }
          })
        }
      },
      disabledBtn() {
        this.disabledVal = !(this.title !== '' && this.input !== '');
      }
    }
  }
</script>

<style scoped>
  .editor-container {
    min-height: 480px;
    border: 1px solid #cacaca;
    border-radius: 3px;
    box-shadow: inset 0 1px 2px rgba(51, 51, 51, 0.1);
    padding: 0;
  }

  .post-title {
    margin-bottom: 10px;
  }
  .post-tags {
    margin: 10px 0;
  }

  .editor-name {
    text-align: right;
    font-size: 0.8em;
    color: #cacaca;
  }

  .btn-submit-post {
    border-radius: 0;
    width: 120px;
    margin-bottom: 1em;
  }

  #editor {
    margin: 0;
    height: 100%;
    font-family: 'Helvetica Neue', Arial, sans-serif;
    color: #333;
  }
  #editor textarea,
  #editor div {
    display: inline-block;
    width: 49%;
    height: 480px;
    vertical-align: top;
    box-sizing: border-box;
    padding: 0.5rem;
    border-radius: 3px;
  }
  #editor textarea {
    resize: none;
    border: 0;
    border-right: 1px solid #cacaca;
    border-top-right-radius: 0;
    -moz-border-radius-topright: 0;
    border-bottom-right-radius: 0;
    -moz-border-radius-bottomright: 0;
  }
  #editor div {
    background-color: #fcfaf2;
    overflow: auto;
  }
</style>
