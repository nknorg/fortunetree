<template>
  <div class="sidebar-module">
    <div class="sidebar-tit"><strong>Tags</strong></div>
    <div class="sidebar-item" v-for="tag in tags">
      <router-link :to="{name: 'Articles', params: {name:tag.name}}">{{tag.name}}</router-link>
    </div>
  </div>
</template>

<script>
	export default {
    name: "tag-list",
    props: ['tags']
  }
</script>

<style scoped>
  .sidebar-module {
    background-color: white;
    border: 1px solid #eee;
    padding: 1.5em 2em;
    margin-bottom: 1em;
    box-shadow: 0 5px 10px 0 transparent;
  }

  .sidebar-tit {
    margin-bottom: 10px;
  }

  .sidebar-item {
    margin: 3px 0 10px;
  }
  .sidebar-item > a {
    text-decoration: none;
    color: #333;
  }
</style>
