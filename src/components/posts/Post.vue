<template>
  <div class="container">
    <editor></editor>
  </div>
</template>

<script>
  import Editor from './../common/Editor'

	export default {
    name: "post",
    created() {
      if (this.$store.state.BlockChain.AccountInfo.address === '') {
        $("#inputPwdModal").modal("show")
      }
    },
    components: {
      Editor
    }
  }
</script>
