<template>
  <div class="stepper-wrapper">
    <div class="stepper-line" aria-hidden="true"></div>

    <div class="steps-container" role="list">
      <div
        v-for="(step, i) in steps"
        :key="step.key ?? i"
        class="step-item"
        :class="{ clickable: clickable }"
        role="listitem"
      >
        <!-- clickable marker -->
        <div
          class="step-circle"
          :class="{ active: i === currentIndex }"
          @click="handleClick(i)"
          @keydown.enter.prevent="handleClick(i)"
          @keydown.space.prevent="handleClick(i)"
          :tabindex="clickable ? 0 : -1"
          :aria-current="i === currentIndex ? 'step' : undefined"
          role="button"
          :aria-label="`Step ${i + 1}: ${step.title}`"
        >
          <div v-if="i === currentIndex" class="inner-dot"></div>
        </div>

        <div class="step-labels">
          <div class="step-number">STEP {{ i + 1 }}</div>
          <div class="step-title">{{ step.title }}</div>
          <div class="step-subtitle">{{ step.subtitle }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from "vue";

  type Step = {
    key?: string | number;
    title: string;
    subtitle?: string;
    tooltip?: string;
  };

  // props
  const props = defineProps<{
    steps: Step[];
    current?: number;
    clickable?: boolean;
  }>();

  // emits
  const emit = defineEmits<{
    (e: "update:current", idx: number): void;
    (e: "step-click", idx: number): void;
  }>();

  // default clickable true
  const clickable = props.clickable ?? true;

  // normalized current index (clamped)
  const currentIndex = computed(() => {
    const c = typeof props.current === "number" ? Math.floor(props.current) : 0;
    const max = Math.max(0, (props.steps?.length ?? 1) - 1);
    return Math.min(Math.max(0, c), max);
  });

  // handle click: emit events
  function handleClick(i: number) {
    if (!clickable) return;
    emit("step-click", i);
    emit("update:current", i);
  }
</script>

<style scoped>
  /* Outer container */
  .stepper-wrapper {
    position: relative;
    width: 100%;
    padding-top: 20px;
  }

  /* Step layout */
  .steps-container {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    position: relative;
    z-index: 2;
    width: 100%;
  }

  /* Each step block */
  .step-item {
    text-align: left;
    width: 150px;
    user-select: none;
  }

  /* make cursor show clickable when allowed */
  .step-item.clickable {
    cursor: pointer;
  }

  /* Step circle */
  .step-circle {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #c8e0f5;
    border: 2px solid transparent; /* thinner border for smaller size */
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 8px;
    outline: none;
  }

  /* Adjust active inner dot to scale properly */
  .inner-dot {
    width: 8px;
    height: 8px;
    background: #0d6efd;
    border-radius: 50%;
  }

  /* Center the timeline perfectly behind circles */
  .stepper-line {
    position: absolute;
    top: 22px; /* ⬅️ Adjusted so the line passes exactly through circle centers */
    left: 0;
    right: 0;
    height: 3px;
    background: #e5eef8;
    z-index: 1;
  }

  /* keyboard focus */
  .step-circle:focus {
    box-shadow: 0 0 0 4px rgba(13, 110, 253, 0.12);
  }

  /* Active circle */
  .step-circle.active {
    background: white;
    border-color: #0d6efd;
  }

  /* Step text */
  .step-labels {
    margin-top: 4px;
  }

  .step-number {
    font-size: 11px;
    color: gray;
    margin-bottom: 4px;
  }

  .step-title {
    font-weight: 600;
  }

  .step-subtitle {
    font-size: 11px;
    color: gray;
  }
</style>
