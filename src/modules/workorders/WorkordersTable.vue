<!-- src/modules/workorders/WorkOrdersTable.vue -->
<template>
  <div class="table-responsive">
    <table class="table table-borderless">
      <thead>
        <tr>
          <th>W.O. #</th>
          <th>Client name</th>
          <th>Type</th>
          <th>Status</th>
          <th>Email</th>
          <th>Last activity</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="!items || items.length === 0">
          <td :colspan="7" class="text-center text-muted">No records found</td>
        </tr>

        <tr v-for="(it, idx) in items" :key="it.workOrderId">
          <td>
            <a href="#" @click.prevent="$emit('view', it)">{{
              it.workOrderId
            }}</a>
          </td>
          <td>{{ it.clientName }}</td>
          <td>{{ it.workOrderName }}</td>
          <td>{{ it.status }}</td>
          <td>{{ it.email }}</td>
          <td>{{ formatDate(it.lastActivity) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
  import type { WorkOrderDetail } from "./WorkOrderType";
  import { toRef } from "vue";

  const props = defineProps({
    items: { type: Array as () => WorkOrderDetail[], required: true },
  });

  const emit = defineEmits<{
    (e: "view", item: WorkOrderDetail): void;
  }>();

  function formatDate(iso?: string) {
    if (!iso) return "";
    try {
      return new Date(iso).toLocaleDateString();
    } catch {
      return iso;
    }
  }
</script>

<style scoped>
  .table td {
    vertical-align: middle;
  }
</style>
