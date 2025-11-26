<template>
  <aside class="app-sidebar">
    <div class="p-3">
      <div class="d-flex justify-content-between align-items-center mb-2" @click="toggle">
        <h6 class="fw-bold text-secondary mb-0">Block Fee Agreement (BFA)</h6>
        <i class="bi" :class="isOpen ? 'bi-chevron-down' : 'bi-chevron-up'"></i>
      </div>

      <div v-show="isOpen">
        <ul class="nav flex-column small">
          <li class="nav-item mb-2">
            <RouterLink to="/bfa/issue" class="nav-link text-dark text-nowrap">Issue Block Fee Agreement</RouterLink>
          </li>
          <li class="nav-item mb-2">
            <RouterLink to="/bfa/amend" class="nav-link text-dark text-nowrap">Amend Block Fee Agreement</RouterLink>
          </li>
          <li class="nav-item mb-2">
            <RouterLink to="/bfa/terminate" class="nav-link text-dark text-nowrap">Terminate Block Fee Agreement</RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const isOpen = ref(true)
function toggle() { isOpen.value = !isOpen.value }
</script>

<style scoped>
.app-sidebar{
  position: fixed;
  top: var(--header-h);
  bottom: var(--footer-h);
  left: 0;
  width: var(--sidebar-w);
  background: #fff;
  border-right: 1px solid #e9ecef;
  overflow-y: auto;
  z-index: 1050; /* above main content, below header/footer */
}

/* ensure menu entries don't wrap */
.text-nowrap { white-space: nowrap; }
</style>
