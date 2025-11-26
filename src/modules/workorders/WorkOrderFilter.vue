<template>
  <form class="workorder-filter-form" @submit.prevent="emitSearch">
    <div class="row g-2 align-items-end">

      <!-- Search box -->
      <div class="col-md">
        <input
          v-model="filters.q"
          type="text"
          class="form-control"
          placeholder="Client name / W.O. #"
        />
      </div>

      <!-- Work Order Type -->
      <div class="col-md">
        <select v-model="filters.type" class="form-select">
          <option value="">All types</option>
          <option value="Issue BFA">Issue BFA</option>
          <option value="Amend BFA">Amend BFA</option>
          <option value="Terminate BFA">Terminate BFA</option>
        </select>
      </div>

      <!-- Status -->
      <div class="col-md">
        <select v-model="filters.status" class="form-select">
          <option value="">All status</option>
          <option value="Options">Options</option>
          <option value="Agreement">Agreement</option>
          <option value="Invoice">Invoice</option>
        </select>
      </div>

      <!-- From Date -->
      <div class="col-md">
        <input
          v-model="filters.from"
          type="date"
          class="form-control"
        />
      </div>

      <!-- To Date -->
      <div class="col-md">
        <input
          v-model="filters.to"
          type="date"
          class="form-control"
        />
      </div>

      <!-- Search Button -->
      <div class="col-md-auto">
        <button class="btn btn-primary px-4" type="submit">Search</button>
      </div>

    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import type { WorkOrdersQuery } from "./WorkOrderType";

const emit = defineEmits<{
  (e: "search", filters: WorkOrdersQuery): void;
}>();

const filters = reactive<WorkOrdersQuery>({
  q: "",
  type: "",
  status: "",
  from: "",
  to: "",
});

function emitSearch() {
  emit("search", { ...filters });
}
</script>

<style scoped>
.workorder-filter-form {
  padding: 10px 0;
}

@media (min-width: 992px) {
  /* Keep all filters in 1 line on large screens */
  .workorder-filter-form .row {
    flex-wrap: nowrap;
  }
}
</style>
