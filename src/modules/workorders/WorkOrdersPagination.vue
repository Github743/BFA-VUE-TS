<template>
  <div class="d-flex align-items-center justify-content-between flex-wrap gap-2">

    <!-- left: summary -->
    <div>
      <span class="badge bg-light text-dark p-2">
        <span v-if="total === 0">Showing 0 entries</span>
        <span v-else>Showing {{ from }} to {{ to }} of {{ total }} entries</span>
      </span>
    </div>

    <!-- right: controls -->
    <div class="d-flex align-items-center gap-3">

      <!-- rows per page -->
      <div class="d-flex align-items-center gap-2">
        <label class="small mb-0">Rows per page:</label>
        <select
          class="form-select form-select-sm"
          v-model.number="localPageSize"
          @change="onPageSizeChange"
          aria-label="Rows per page"
          style="width: 72px;"
        >
          <option v-for="r in pageSizeOptions" :key="r" :value="r">{{ r }}</option>
        </select>
      </div>

      <!-- pagination controls -->
      <div class="d-flex align-items-center gap-2">
        <!-- prev -->
        <button
          class="btn btn-outline-secondary btn-page btn-sm"
          :disabled="page <= 1"
          @click="go(page - 1)"
          aria-label="Previous"
          title="Previous"
        >
          <i class="bi bi-chevron-left"></i>
        </button>

        <!-- page buttons -->
        <div class="d-flex align-items-center gap-2">
          <button
            v-for="p in pages"
            :key="p"
            class="btn btn-sm btn-page"
            :class="{'btn-primary text-white': p === page, 'btn-light': p !== page}"
            @click="go(p)"
            :aria-current="p === page ? 'page' : undefined"
            :title="`Page ${p}`"
          >
            {{ p }}
          </button>
        </div>

        <!-- next -->
        <button
          class="btn btn-outline-secondary btn-page btn-sm"
          :disabled="page >= totalPages"
          @click="go(page + 1)"
          aria-label="Next"
          title="Next"
        >
          <i class="bi bi-chevron-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = defineProps({
  total: { type: Number, required: true },
  page: { type: Number, required: true },
  pageSize: { type: Number, required: true },
  pageSizeOptionsProp: { type: Array as () => number[] | undefined, default: undefined },
  maxPageButtons: { type: Number, required: false, default: 5 } // how many numeric buttons to show
})

const emit = defineEmits<{
  (e: 'page', page: number): void
  (e: 'page-size', size: number): void
}>()

const localPageSize = ref<number>(props.pageSize)
watch(() => props.pageSize, v => (localPageSize.value = v))

const pageSizeOptions = computed<number[]>(() =>
  props.pageSizeOptionsProp && props.pageSizeOptionsProp.length ? props.pageSizeOptionsProp : [10, 20, 50, 100]
)

const totalPages = computed(() => Math.max(1, Math.ceil(props.total / Math.max(1, props.pageSize))))
const from = computed(() => (props.total === 0 ? 0 : Math.min(props.total, (props.page - 1) * props.pageSize + 1)))
const to = computed(() => Math.min(props.total, props.page * props.pageSize))

function go(p: number) {
  const max = totalPages.value
  if (p < 1) p = 1
  if (p > max) p = max
  if (p !== props.page) emit('page', p)
}

function onPageSizeChange() {
  const newSize = Number(localPageSize.value) || props.pageSize
  if (newSize !== props.pageSize) {
    emit('page-size', newSize)
    // reset to page 1 to avoid out-of-range page
    emit('page', 1)
  }
}

/* compute pages array with sliding window centered on current page */
const pages = computed(() => {
  const maxButtons = Math.max(1, props.maxPageButtons)
  const total = totalPages.value
  if (total <= maxButtons) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  const half = Math.floor(maxButtons / 2)
  let start = Math.max(1, props.page - half)
  let end = start + maxButtons - 1
  if (end > total) {
    end = total
    start = Math.max(1, end - maxButtons + 1)
  }
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})
</script>

<style scoped>
/* round page buttons to match design */
.btn-page {
  width: 36px;
  height: 36px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: transform .05s ease;
}

/* smaller chevron buttons match circle look but outlined */
.btn-page.btn-sm i {
  font-size: 1rem;
}

/* active page */
.btn-primary {
  background-color: #0d6efd !important; /* bootstrap primary */
  border-color: #0d6efd !important;
}

/* spacing/visual tweaks */
.badge {
  font-size: 0.95rem;
}
</style>
