<template>
  <div>
    <ClientDetails v-if="true" />
    <h3>Step 1 — Options</h3>
    <slot />
  </div>
</template>
<script setup lang="ts">
  import ClientDetails from "@/components/common/ClientDetails.vue";
  import { useClientStore } from "@/stores/clientStore";
  const store = useClientStore();
  // reactive refs:
  const client = store.client;
  const loading = store.loading;
  const error = store.error;
</script>
<style scoped></style>
