<template>
  <div id="countingBar">
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

const props = defineProps(['count']);

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
    labels: [''],
    datasets: [
      {
        data: [props.count],
        backgroundColor: ['#deb887'],
      },
    ],
  };
});
</script>
<style scoped>
#countingBar {
  display: inline-block;
  height: 100%;
  width: 10%;
}
</style>
