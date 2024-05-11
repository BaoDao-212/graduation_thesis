<template>
  <div class="page-container">
    <div>
      <h1>404</h1>
      <h1> OOPS! You seem to be lost...</h1>
      <RouterLink :to="{ path: '/', replace: true }" class="ant-btn ant-btn-primary"
        >Back to the homepage</RouterLink
      >
    </div>
    <img src="@/assets/404.gif" alt="" />
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  export default defineComponent({
    name: 'NotFound',
  });
</script>

<style lang="less" scoped>
  .page-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
    background-color: white;
  }
</style>
