<template>
  <div class="hey-there">
    <h1 class="h1-def">{{greeting}}</h1>
    <p v-if="action">Start {{action}}</p>
  </div>
</template>

<script>
export default {
  name: 'hey-there',
  props: {
    action: String,
  },
  data() {
    return {
      greeting: 'Hey, there.',
    };
  },
}
</script>

<style lang="scss" scoped>
.hey-there {
  margin-bottom: .4rem;
  .h1-def {
    display: block;
    font-size: 2em;
    margin-top: 0.67em;
    margin-bottom: 0.67em;
    margin-left: 0;
    margin-right: 0;
    font-weight: bold;
  }
}
</style>
