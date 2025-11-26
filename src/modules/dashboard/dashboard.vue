<template>
  <div class="dashboard-container">
    <h1 class="page-title" style="margin-top: 30px;">Block Fee Agreement Management</h1>

    <div class="row g-4">
      <div
        v-for="card in statCards"
        :key="card.id"
        class="col-12 col-sm-6 col-lg-4 col-xl"
      >
        <div class="stats-card">
          <div class="icon-box" :class="card.colorClass">
            <i :class="card.icon"></i>
          </div>
          <div class="stats-label">{{ card.label }}</div>
          <div class="stats-value">{{ card.value }}</div>
          <div class="stats-change">
            <i :class="card.changeIcon"></i> {{ card.changeText }}
          </div>
        </div>
      </div>
    </div>

    <div class="chart-card">
      <h2 class="chart-title">Bar Graph of count of - New and Removed vessels</h2>

      <div class="bar-chart">
        <div class="y-axis">
          <div>80</div>
          <div>60</div>
          <div>40</div>
          <div>20</div>
          <div>0</div>
        </div>

        <div
          v-for="(group, idx) in barGroups"
          :key="idx"
          class="bar-group"
        >
          <div class="bars">
            <div
              v-for="(bar, bidx) in group"
              :key="bidx"
              class="bar"
              :class="bar.color"
              :style="{ height: bar.height + 'px' }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

type StatCard = {
  id: string
  label: string
  value: number | string
  colorClass: string
  icon: string
  changeIcon: string
  changeText: string
}

type Bar = {
  color: 'blue' | 'orange'
  height: number // px (for the simple demo)
}

type BarGroup = Bar[]

const statCards = ref<StatCard[]>([
  {
    id: 'active-bfas',
    label: 'Active BFAs',
    value: 247,
    colorClass: 'blue',
    icon: 'fas fa-check',
    changeIcon: 'fas fa-arrow-up',
    changeText: '+12% vs last month'
  },
  {
    id: 'enrolled-vessels',
    label: 'Enrolled Vessels',
    value: 184,
    colorClass: 'green',
    icon: 'fas fa-ship',
    changeIcon: 'fas fa-arrow-up',
    changeText: '+12% vs last month'
  },
  {
    id: 'pending-amendments',
    label: 'Pending Amendments',
    value: 23,
    colorClass: 'yellow',
    icon: 'fas fa-clock',
    changeIcon: 'fas fa-arrow-up',
    changeText: '+12% vs last month'
  },
  {
    id: 'mid-cycle-1',
    label: 'Mid-Cycle Enrollments',
    value: 18,
    colorClass: 'purple',
    icon: 'fas fa-user-plus',
    changeIcon: 'fas fa-arrow-up',
    changeText: '+12% vs last month'
  },
  {
    id: 'mid-cycle-2',
    label: 'Mid-Cycle Enrollments',
    value: 18,
    colorClass: 'orange',
    icon: 'fas fa-file-alt',
    changeIcon: 'fas fa-arrow-up',
    changeText: '+12% vs last month'
  }
])

// simple demo bar groups (replace with real data later)
const barGroups = ref<BarGroup[]>([
  [{ color: 'blue', height: 200 }, { color: 'orange', height: 90 }],
  [{ color: 'blue', height: 100 }],
  [{ color: 'blue', height: 120 }, { color: 'orange', height: 45 }],
  [{ color: 'blue', height: 100 }],
  [{ color: 'blue', height: 200 }, { color: 'orange', height: 90 }],
  [{ color: 'blue', height: 100 }]
])
</script>

<style scoped>
.dashboard-container {
  padding: 10px;
  max-width: 1400px;
  margin: 0 auto;
}
.page-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 30px;
  color: #212529;
}
.stats-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  height: 100%;
}
.stats-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
.stats-card .icon-box {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
}
.icon-box.blue { background-color: #e3f2fd; color: #1976d2; }
.icon-box.green { background-color: #e8f5e9; color: #388e3c; }
.icon-box.yellow { background-color: #fff9c4; color: #f57c00; }
.icon-box.purple { background-color: #f3e5f5; color: #7b1fa2; }
.icon-box.orange { background-color: #fff3e0; color: #f57c00; }

.stats-label {
  font-size: 13px;
  color: #6c757d;
  margin-bottom: 8px;
}
.stats-value {
  font-size: 32px;
  font-weight: 700;
  color: #212529;
  margin-bottom: 8px;
}
.stats-change {
  font-size: 13px;
  color: #28a745;
}
.stats-change i {
  font-size: 10px;
}
.chart-card {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-top: 30px;
}
.chart-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 25px;
  color: #212529;
}
.bar-chart {
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  height: 300px;
  padding: 20px 0;
  position: relative;
}
.bar-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  flex: 1;
}
.bars {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  height: 250px;
}
.bar {
  width: 35px;
  border-radius: 4px 4px 0 0;
  transition: all 0.3s ease;
}
.bar.blue { background-color: #1976d2; }
.bar.orange { background-color: #fb8c00; }
.bar:hover {
  opacity: 0.8;
  transform: scaleY(1.02);
}
.y-axis {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px 0;
  font-size: 12px;
  color: #6c757d;
}
</style>
