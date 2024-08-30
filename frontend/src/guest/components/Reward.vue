<template>
  <h1>Reward</h1>
  <p>{{ reward }}</p>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps(['contents']);

const reward = computed(() => {
  return props.contents.reward.message;
});
</script>
