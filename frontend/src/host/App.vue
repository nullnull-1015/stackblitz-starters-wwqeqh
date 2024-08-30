<template>
  <header></header>

  <main>
    <div class="wrapper">
      <component
        v-bind:is="pageType"
        v-bind:contents="contents"
        ref="field"
      ></component>
      <button @click="prevPage">←</button>
      <button @click="nextPage">→</button>
    </div>
  </main>
</template>

<script setup>
import { ref, shallowRef, computed, onMounted } from 'vue';
import NoPage from './components/NoPage.vue';
import Game from './components/Game/Game.vue';
import socket from '../api/index.js';

const pageType = shallowRef(NoPage);
const pages = {
  NoPage,
  Game,
};
const contents = ref({});

const setPage = (pageName, newContents) => {
  pageType.value = pages[pageName];
  contents.value = newContents;
};

// communication
// receiver
socket.on('update', (msg) => {
  let message = msg.content;
  console.log(message);
  setPage(msg.type, msg.content);
});

onMounted(() => {
  socket.emit('join', {
    user: 'host',
  });
  socket.on('joined', () => {
    socket.emit('message', {
      type: 'curr',
      user: 'host',
    });
  });
});

import { startAnim, finishAnim } from '@/api/anim.js';

const field = ref(null);
const updateGame = () => {
  console.log(pageType.value, field.value);
  if (pageType.value === Game) {
    console.log('called');
    field.value.damage = 0;
  }
};

// sender
const nextPage = () => {
  socket.emit('message', {
    type: 'next',
    user: 'host',
  });
  updateGame();
};
const prevPage = () => {
  socket.emit('message', {
    type: 'prev',
    user: 'host',
  });
  updateGame();
};
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
