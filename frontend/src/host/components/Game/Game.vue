<template>
  <div>
    <div>
      <component
        :is="pages[contents.type]"
        v-bind:contents="contents.content"
      ></component>
      <CountBar :count="count" />
    </div>
    <Anim ref="animCanvas" />
    <button @click="start">▶</button>
    <button @click="stop">■</button>
  </div>
</template>

<script setup>
import { ref, shallowRef, computed, onMounted } from 'vue';
import NoPage from '../NoPage.vue';
import OptionQuestion from './OptionQuestion.vue';
import CountBar from './CountBar.vue';
import Anim from './Anim.vue';

import socket from '@/api/index.js';

const props = defineProps(['contents']);
const animCanvas = ref(null);
const damage = ref(0);
const count = computed(() => {
  return props.contents.content.count - damage.value;
});

const pages = {
  NoPage,
  OptionQuestion,
};

const isSuccessed = () => {
  return props.contents.content.count - damage.value > 0;
};

socket.on('anim', (msg) => {
  for (const newAnim of msg.content.animQueue) {
    console.log(newAnim.damage);
    if (newAnim.damage) {
      newAnim.callback = () => {
        damage.value += newAnim.damage;
        if (newAnim.isLast) {
          finishAnim('host');
          startAnim('guest');
          if (isSuccessed()) {
            socket.emit('message', {
              type: 'reward',
              content: {},
            });
          }
        }
      };
    }
    animCanvas.value.animQueue.push(newAnim);
  }
});

import { startAnim, finishAnim, successAnim, failureAnim } from '@/api/anim.js';

const calcDamage = () => {
  let damage = 10;
  if (props.contents.content.goal > damage) {
    const numTry = Math.floor(props.contents.content.goal / damage);
    // 指定票数で丁度打ち消し合うようダメージ調整
    damage = damage + (props.contents.content.goal % numTry) / numTry;
    return {
      damage: damage,
      numTry: numTry,
    };
  } else {
    return { damage: props.contents.content.goal, numTry: 1 };
  }
};

const play = () => {
  const { damage, numTry } = calcDamage();
  let damages = new Array(numTry).fill(damage);

  let idx = 0;
  let totalDamage = 0;
  console.log(damages);
  for (const damage_ of damages) {
    totalDamage += damage_;
    if (totalDamage > props.contents.content.count) {
      failureAnim(damage_, idx == damages.length - 1);
    } else {
      successAnim(damage_, idx == damages.length - 1);
    }
    idx++;
  }
};

const animationOn = ref(false);
const start = () => {
  socket.emit('message', {
    type: 'start',
    user: 'host',
  });
  if (!animationOn.value) {
    animationOn.value = true;
  }
};
const stop = () => {
  socket.emit('message', {
    type: 'stop',
    user: 'host',
  });
  if (animationOn.value) {
    animationOn.value = false;
    finishAnim('guest');
    startAnim('host');
    play();
  }
};

defineExpose({
  animationOn,
  damage,
});
</script>
