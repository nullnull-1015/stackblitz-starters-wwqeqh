<template>
  <div
    class="anim-canvas"
    :style="{
      backgroundImage: `url(${animConfig.url})`,
      backgroundPosition: animConfig.pos + 'px 0',
      width: animConfig.width + 'px',
      height: animConfig.height + 'px',
    }"
  ></div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

const defaultLoop = {
  url: null,
  width: 1048,
  fps: 100,
  interrupt: false,
  index: 0,
  pos: 0,
  loop: -1,
  count: 0,
};

const animConfig = ref(defaultLoop);

const testData = {
  url: 'https://localhost:3000/resource/anim/dog/runningdog.jpg',
  width: 1048,
  height: 260,
  flame: 7,
  fps: 16,
  interrupt: false,
  index: 0,
  pos: 0,
  loop: -1,
  count: 0,
};
const animQueue = ref([testData]);

const test = () => {
  let in_ = {
    url: 'https://localhost:3000/resource/anim/dog/in_runningdog.jpg',
    width: 1048,
    height: 260,
    flame: 8,
    fps: 16,
    interrupt: true,
    index: 0,
    pos: 0,
    loop: 1,
    count: 0,
  };
  let out_ = {
    url: 'https://localhost:3000/resource/anim/dog/out_runningdog.jpg',
    width: 1048,
    height: 260,
    flame: 18,
    fps: 16,
    interrupt: true,
    index: 0,
    pos: 0,
    loop: 1,
    count: 0,
  };

  animQueue.value.push(...[out_, in_]);
};

const updateAnimConfig = () => {
  if (
    animConfig.value.loop > 0 &&
    animConfig.value.count >= animConfig.value.loop
  ) {
    // animation finished
    stopAnimation();
    animConfig.value =
      animQueue.value.length > 0 ? animQueue.value.shift() : defaultLoop;
    startAnimation();
  } else if (
    animQueue.value.length > 0 &&
    (animQueue.value[0].interrupt || !animConfig.value.url)
  ) {
    // intruppted
    stopAnimation();
    const oldConfig = animConfig.value;
    animConfig.value = animQueue.value.shift();
    startAnimation();
  }
};

const play = () => {
  if (!animConfig.value.url) {
    // if animConfig is default loop
    updateAnimConfig();
    return;
  }
  animConfig.value.pos = -animConfig.value.width * animConfig.value.index;
  let newIndex = animConfig.value.index + 1;
  if (newIndex >= animConfig.value.flame) {
    // cycle finished
    animConfig.value.count++;
    animConfig.value.index = 0;
    updateAnimConfig();
  } else {
    animConfig.value.index = newIndex;
  }
};

let animator;
const startAnimation = () => {
  let interval = 1000 / animConfig.value.fps;
  console.log('animation started');
  animator = setInterval(play, interval);
};

const stopAnimation = () => {
  if (animator) {
    clearInterval(animator);
  }
};

onMounted(startAnimation);
onBeforeUnmount(stopAnimation);

defineExpose({
  animQueue,
});
</script>

<style scoped>
.anim-canvas {
  background-repeat: no-repeat;
  background-position: 0 0;
}
</style>
