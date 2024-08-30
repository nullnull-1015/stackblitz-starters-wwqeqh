<template>
  <header></header>

  <main>
    <div class="wrapper">
      <component v-bind:is="pageType" v-bind:contents="contents"></component>
      <Anim ref="animCanvas" />
    </div>
  </main>
</template>

<script setup>
import { ref, shallowRef, computed, onMounted } from 'vue';
import NoPage from './components/NoPage.vue';
import Wait from './components/Wait.vue';
import OptionQuestion from './components/OptionQuestion.vue';
import Reward from './components/Reward.vue';
import Anim from './components/Anim.vue';
import socket from '../api/index.js';

const pageType = shallowRef(NoPage);
const pages = {
  NoPage,
  Wait,
  OptionQuestion,
  Reward,
};
const contents = ref({});
const answered = ref(false);

const animCanvas = ref(null);

const setPage = (pageName, new_contents) => {
  if (pageName == 'Game') {
    pageName = new_contents.type;
    new_contents = new_contents.content;
  }
  pageType.value = pages[pageName];
  contents.value = new_contents;
};

// communication
socket.on('update', (msg) => {
  let message = msg.content;
  setPage(msg.type, msg.content);
});
socket.on('anim', (msg) => {
  animCanvas.value.animQueue.push(...msg.content.animQueue);
});

onMounted(() => {
  socket.emit('join', {
    user: 'guest',
  });
  socket.on('joined', () => {
    socket.emit('message', {
      type: 'curr',
      user: 'guest',
    });
  });
});
</script>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
