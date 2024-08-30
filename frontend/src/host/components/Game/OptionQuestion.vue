<template>
  <div id="option-question">
    <h1>{{ contents.title }}</h1>
    <Bar :options="chartOptions" :data="chartData" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';

const props = defineProps(['contents']);

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const chartOptions = computed(() => {
  return {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        border: {
          color: '#eeeeee',
        },
        grid: {
          display: false,
        },
      },
      y: {
        suggestedMax: 5,
        border: {
          dash: [4],
          color: '#eeeeee',
        },
        ticks: {
          stepSize: 1,
        },
      },
    },
  };
});

const chartData = computed(() => {
  return {
    labels: props.contents.options
      ? props.contents.options.map((option) => option.label)
      : [],
    datasets: [
      {
        data: props.contents.options
          ? props.contents.options.map((option) => option.value)
          : [],
        backgroundColor: props.contents.options
          ? props.contents.options.map((option) => option.color)
          : [],
      },
    ],
  };
});
</script>

<style scoped>
#option-question {
  display: inline-block;
  width: calc(90%);
}
</style>
