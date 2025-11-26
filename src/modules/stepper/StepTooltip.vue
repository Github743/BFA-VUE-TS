<template>
  <div
    class="tooltip-wrapper"
    @mouseenter="show"
    @mouseleave="hide"
    @focus="show"
    @blur="hide"
    tabindex="0"
  >
    <slot />
    <div v-if="visible" :class="['tooltip-bubble', pos]" role="tooltip">
      {{ text }}
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from "vue";
  const props = defineProps<{ text: string; pos?: "top" | "bottom" }>();
  const emit = defineEmits<{}>();
  const visible = ref(false);
  const pos = props.pos || "top";
  function show() {
    visible.value = true;
  }
  function hide() {
    visible.value = false;
  }
</script>

<style scoped>
  .tooltip-wrapper {
    position: relative;
    display: inline-block;
  }
  .tooltip-bubble {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.82);
    color: #fff;
    padding: 6px 8px;
    border-radius: 6px;
    font-size: 12px;
    white-space: nowrap;
    z-index: 2000;
    transition: opacity 0.12s ease;
  }
  .tooltip-bubble.top {
    bottom: calc(100% + 10px);
  }
  .tooltip-bubble.bottom {
    top: calc(100% + 10px);
  }
</style>
