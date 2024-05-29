<template>
  <div class="user-info-container">
    <h2 class="user-info-title">User Information</h2>
    <div  class="user-info-grid">
      <div v-if="props.owner" class="user-info-item">
        <strong class="user-info-label">Name:</strong>
        <span class="user-info-value">{{ props.owner.name }}</span>
      </div>
      <div class="user-info-item">
        <strong class="user-info-label">Username:</strong>
        <span class="user-info-value">{{ props.owner.username }}</span>
      </div>
      <div class="user-info-item">
        <strong class="user-info-label">Email:</strong>
        <span class="user-info-value">{{ props.owner.email }}</span>
      </div>
      <div class="user-info-item">
        <strong class="user-info-label">Phone:</strong>
        <span class="user-info-value">{{ props.owner.phone }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
  import Storage from '@/utils/Storage';
  import { ref, computed, defineProps } from 'vue';

  const props = defineProps({
    owner: {
      type: Object,
      required: true,
    },
  });
  const user = ref(props.owner);
  // You can use computed properties to format data if needed
  const formattedCreatedAt = computed(() => {
    return new Date(user.value.createdAt).toLocaleDateString();
  });

  const formattedUpdatedAt = computed(() => {
    return new Date(user.value.updatedAt).toLocaleDateString();
  });
</script>
<style scoped>
  .user-info-container {
    padding: 20px;
    border: none; /* Remove border */
    border-radius: 8px;
    background-color: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    width: 100%;
  }

  .user-info-title {
    font-size: 1.8rem;
    margin-bottom: 20px;
    color: #262626; /* Darker heading color */
  }

  .user-info-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px; /* Increased gap */
  }

  .user-info-item {
    padding: 16px;
    border: 1px solid #f0f0f0; /* Light gray border */
    border-radius: 8px;
    background-color: #fff;
    box-shadow: none; /* Remove item shadow */
  }

  .user-info-label {
    font-weight: 600;
    color: #595959; /* Slightly lighter label color */
    display: block; /* Labels on their own line */
    margin-bottom: 8px; /* Space between label and value */
  }

  .user-info-value {
    font-weight: 400; /* Normal weight for value */
    color: #262626;
  }
</style>
