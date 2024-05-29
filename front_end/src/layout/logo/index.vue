<template>
  <div class="logo">
    <img src="~@/assets/images/logo0.png" alt="" />
    <div v-show="!collapsed" class="title">Study Quiz Center</div>
  </div>
</template>

<script setup>
  defineProps({
    collapsed: {
      type: Boolean,
    },
  });
</script>

<style lang="less" scoped>
  .logo {
    @apply flex overflow-hidden whitespace-nowrap items-center;

    height: 64px;
    padding-left: 24px;
    line-height: 64px;

    img {
      height: 32px;
      margin-right: 8px;
    }

    .title {
      @apply mb-0 text-lg;

      color: @primary-color;
    }
  }
</style>
