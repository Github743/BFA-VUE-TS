<template>
  <div class="min-h-screen flex flex-col">
    <AppTopbar />

    <div class="flex flex-1 overflow-hidden">
      <!-- sidebar is fixed: AppSidebar will place itself -->
      <AppSidebar v-if="showSidebar" />

      <!-- main area: margin-left should equal sidebar width -->
      <main
        class="flex-fill bg-white"
        style="
          margin-left: 253px;
          padding: 0 1.5rem !important;
          padding-top: 0 !important;
          min-height: calc(100vh - 56px);
          overflow-y: auto;
        "
      >
        <div
          class="w-full min-h-[calc(100vh - var(--header-h) - var(--footer-h))] p-4 lg:p-6"
        >
          <router-view />
        </div>
      </main>
    </div>

    <AppFooter />
  </div>
</template>

<script setup lang="ts">
  import { useRoute } from "vue-router";
  import AppTopbar from "./AppTopbar.vue";
  import AppSidebar from "./AppSidebar.vue";
  import AppFooter from "./AppFooter.vue";
  import { computed } from "vue";

  const route = useRoute();
  const showSidebar = computed(() => route.meta.sidebar === true);
</script>
