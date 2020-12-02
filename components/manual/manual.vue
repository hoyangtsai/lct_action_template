<template>
  <div class="manual">
    <h1 class="manual-title">{{instruction}}</h1>
    <h2>第一步</h2>
    <code>tnpm install</code>
    <h2>第二步</h2>
    <code>npm run dev</code>
  </div>
</template>

<script>
export default {
  name: 'manual',
  props: {
    action: String,
  },
  data() {
    return {
      instruction: '指引',
    };
  },
}
</script>

<style lang="scss" scoped>
.manual {
  margin-bottom: .4rem;
  &-title {
    display: block;
    font-size: 2em;
    margin-top: 0.67em;
    margin-bottom: 0.67em;
    margin-left: 0;
    margin-right: 0;
    font-weight: bold;
  }
}

h2 {
  display: block;
  font-size: 1.5em;
  margin-top: 0.83em;
  margin-bottom: 0.83em;
  margin-left: 0;
  margin-right: 0;
  font-weight: bold;
}
</style>
