<template>
  <nav
    aria-label="breadcrumb"
    class="simple-breadcrumb d-flex align-items-center gap-2"
  >
    <!-- root / section -->
    <div class="crumb-section fw-bold">BFA</div>

    <!-- chevron (Bootstrap Icon) -->
    <i class="bi bi-chevron-right crumb-chev" aria-hidden="true"></i>

    <!-- page title -->
    <div class="crumb-title fw-bold">{{ title }}</div>
  </nav>
</template>

<script setup lang="ts">
  import { computed } from "vue";
  import { useRoute } from "vue-router";

  const route = useRoute();

  // page title: prefer route.meta.title, fallback to route.name/path
  const title = computed(() => {
    return (
      (route.meta && (route.meta as any).title) ||
      (route.name as string) ||
      route.path
    );
  });
</script>

<style scoped>
  .simple-breadcrumb {
    padding: 8px 0;
    align-items: center;
    gap: 10px;
  }

  /* left section (BFA) */
  .crumb-section {
    font-size: 12px;
    color: #111;
    letter-spacing: -0.5px;
  }

  /* chevron style */
  .crumb-chev {
    color: #6c757d; /* muted gray */
    font-size: 12px;
  }

  /* page title */
  .crumb-title {
    font-size: 15px;
    color: #111;
    margin-left: 4px;
  }

  /* small responsive tweak */
  @media (min-width: 992px) {
    .crumb-section {
      font-size: 20px;
    }
    .crumb-title {
      font-size: 20px;
    }
  }
</style>
