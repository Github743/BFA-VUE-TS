<!-- src/modules/workorders/WorkOrdersPage.vue -->
<template>
  <div>
    <h4>BFA Workorders</h4>

    <WorkOrderFilter @search="onFiltersApplied" />

    <WorkOrdersTable
      :items="items"
      @edit="onEdit"
      @delete="onDelete"
      @view="onView"
    />

    <WorkOrdersPagination
      :total="total"
      :page="page"
      :pageSize="pageSize"
      @page="onPage"
      @page-size="onPageSize"
    />

    <div v-if="loading" class="loading-overlay">
      <div class="spinner-border" role="status"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from "vue";
  import WorkOrderFilter from "./WorkOrderFilter.vue";
  import WorkOrdersTable from "./WorkordersTable.vue";
  import WorkOrdersPagination from "./WorkOrdersPagination.vue";

  import type { WorkOrdersQuery, WorkOrderDetail } from "./WorkOrderType";
  import { fetchWorkOrders } from "./WorkOrdersApi";

  import { useRouter } from "vue-router";
  import { useWorkflowStore } from "@/stores/workflowStore";

  const items = ref<WorkOrderDetail[]>([]);
  const total = ref(0);
  const page = ref(1);
  const pageSize = ref(10);
  const loading = ref(false);

  const router = useRouter();
  const workflow = useWorkflowStore();

  // keep last used filters so pagination uses same filters
  const currentFilters = ref<WorkOrdersQuery>({});

  async function loadWorkorders(query: WorkOrdersQuery = {}, pageNum = 1) {
    loading.value = true;
    try {
      const q = { ...query, page: pageNum, pageSize: pageSize.value };
      const res = await fetchWorkOrders(q);
      items.value = res.items;
      total.value = res.total;
      page.value = res.page;
      currentFilters.value = query;
    } catch (err) {
      console.error("Failed to load workorders", err);
      items.value = [];
      total.value = 0;
    } finally {
      loading.value = false;
    }
  }

  function onFiltersApplied(query: WorkOrdersQuery) {
    page.value = 1;
    loadWorkorders(query, 1);
  }

  function onPage(newPage: number) {
    page.value = newPage;
    loadWorkorders(currentFilters.value, newPage);
  }

  function onEdit(item: WorkOrderDetail) {
    // navigate or open modal
  }
  function onPageSize(newSize: number) {
    // update pageSize and reset to page 1 (child may already emit page=1,
    // but doing both is safe and ensures consistent state)
    pageSize.value = newSize;
    page.value = 1;
  }

  function onDelete(item: WorkOrderDetail) {}

  function onView(item: WorkOrderDetail) {
    workflow.setWorkOrderId(1010694);
    workflow.setCurrentStep(0);

    router.push({ name: "IssueWorkflow" });
  }

  // initial load: default empty filters
  loadWorkorders({}, 1);
</script>

<style scoped>
  /* add page-specific style if needed */
  .loading-overlay {
    position: fixed; /* overlay the whole screen */
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.7); /* slight fade background */
    display: flex;
    align-items: center; /* vertical center */
    justify-content: center; /* horizontal center */
    z-index: 9999; /* stay on top */
  }

  .loading-spinner {
    width: 3rem;
    height: 3rem;
  }
</style>
