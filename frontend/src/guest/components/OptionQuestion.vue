<template>
  <button v-for="(option, index) in options" @click="vote(index)">
    {{ option }}
  </button>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue';

const props = defineProps(['contents']);

const voteVal = ref(1);

const options = computed(() => {
  return props.contents.options.map((option) => option.label);
});

import socket from '../../api/index.js';

const vote = (id) => {
  socket.emit('message', {
    type: 'vote',
    user: 'guest',
    content: {
      id: id,
      value: voteVal.value,
    },
  });
};
</script>
<style></style>
