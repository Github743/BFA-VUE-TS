<template>
  <section class="client-details">
    <!-- Title with underline -->
    <div class="header-row">
      <span class="title">Client Details</span>
    </div>
    <div class="underline"></div>

    <!-- Loading & Error -->
    <div v-if="loading" class="text-muted mt-2">Loading client...</div>
    <div v-else-if="error" class="text-danger mt-2">Failed to load client</div>
    <div v-else-if="!client" class="text-muted mt-2">No client selected</div>

    <!-- Client Data -->
    <div v-else class="client-grid mt-3">
      <div><strong>CLIENT NAME</strong><br />{{ client.clientName }}</div>
      <div><strong>CLIENT NUMBER</strong><br />{{ client.clientNumber }}</div>
      <div><strong>STATUS</strong><br />{{ client.status }}</div>
      <div><strong>CITY</strong><br />{{ client.city }}</div>
      <div><strong>COUNTRY</strong><br />{{ client.country }}</div>
      <div><strong>ROLES</strong><br />{{ roles }}</div>
    </div>
  </section>
</template>

<script setup lang="ts">
  import { computed } from "vue";
  import { useClientStore } from "@/stores/clientStore";

  const store = useClientStore();
  const client = computed(() => store.client); // now TS-safe
  const loading = computed(() => store.loading);
  const error = computed(() => store.error);

  const roles = computed(() => {
    const c = client.value;
    if (!c) return "";
    const r = c.roles ?? c.clientRoles ?? "";
    return Array.isArray(r) ? r.join(", ") : String(r);
  });
</script>

<style scoped>
  /* Title styling */
  .header-row {
    margin-bottom: 4px;
  }

  .title {
    font-size: 14px;
    font-weight: 600;
    color: #1d6be4;
  }

  /* Thin underline exactly like screenshot */
  .underline {
    width: 100%;
    border-bottom: 1px solid #e5e7eb;
    margin-bottom: 12px;
  }

  /* Matching screenshot layout */
  .client-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 12px;
    font-size: 14px;
  }

  .client-grid div strong {
    font-size: 11px;
    color: #6b7280;
    text-transform: uppercase;
  }
</style>
