<template>
  <div id="app">
    <query-generator></query-generator>

  </div>
</template>

<script>
import QueryGenerator from './components/QueryGenerator.vue'

export default {
  name: 'App',
  components: {
    QueryGenerator
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

</style>
