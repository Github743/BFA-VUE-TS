<template>
  <div :class="['table-responsive', { compact }]">
    <!-- bulk delete -->
    <div v-if="enableBulkDelete && selectedCount >= minBulkCount" class="mb-2">
      <button
        class="btn btn-danger btn-sm"
        @click="onBulkDelete"
        :disabled="deleting"
      >
        <span
          v-if="deleting"
          class="spinner-border spinner-border-sm"
          role="status"
          aria-hidden="true"
        ></span>
        {{ bulkDeleteLabel }} ({{ selectedCount }})
      </button>
    </div>

    <table class="table align-middle custom-table">
      <thead class="small-headers">
        <tr>
          <th
            v-if="checkboxPosition === 'left' && enableBulkDelete && !readonly"
            style="width: 48px"
          ></th>

          <th
            v-for="(col, idx) in visibleColumns"
            :key="idx"
            :class="col.headerClass"
          >
            {{ col.label }}
          </th>

          <th
            v-if="showActions && !readonly"
            class="text-center"
            :style="{ width: actionsWidth }"
          >
            ACTION
          </th>

          <th
            v-if="checkboxPosition === 'right' && enableBulkDelete && !readonly"
            style="width: 48px"
          ></th>
        </tr>
      </thead>

      <tbody>
        <tr v-if="!rows || rows.length === 0">
          <td :colspan="colspan" class="text-center text-muted">
            No records found
          </td>
        </tr>

        <tr
          v-for="(row, rowIndex) in rows"
          :key="getRowKey(row, rowIndex)"
          :class="{ 'row-hover': true }"
        >
          <!-- left checkbox -->
          <td
            v-if="checkboxPosition === 'left' && enableBulkDelete && !readonly"
            class="text-center"
          >
            <input
              type="checkbox"
              :value="getRowId(row, rowIndex)"
              v-model="selectedIds"
              aria-label="Select row"
            />
          </td>

          <td
            v-for="(col, colIndex) in visibleColumns"
            :key="colIndex"
            :class="cellClass(col)"
          >
            <slot
              :name="`cell-${String(col.field)}`"
              :row="row"
              :value="getFieldValue(row, col)"
            >
              <template v-if="col.truncate">
                <span
                  class="text-ellipsis"
                  :title="String(getFieldValue(row, col) ?? '')"
                >
                  {{ formatValue(getFieldValue(row, col), col) }}
                </span>
              </template>
              <template v-else>
                {{ formatValue(getFieldValue(row, col), col) }}
              </template>
            </slot>
          </td>

          <!-- actions -->
          <td v-if="showActions && !readonly" class="text-center">
            <slot name="cell-actions" :row="row" :rowIndex="rowIndex">
              <div class="d-flex justify-content-center gap-2">
                <button
                  type="button"
                  class="btn btn-link btn-sm p-0"
                  @click="handleEdit(row, rowIndex)"
                >
                  <i class="bi bi-pencil"></i>
                  <span class="visually-hidden">Edit</span>
                </button>
                <button
                  type="button"
                  class="btn btn-link btn-sm p-0 text-danger"
                  @click="handleDelete(row, rowIndex)"
                >
                  <i class="bi bi-trash"></i>
                  <span class="visually-hidden">Delete</span>
                </button>
              </div>
            </slot>
          </td>

          <!-- right checkbox -->
          <td
            v-if="checkboxPosition === 'right' && enableBulkDelete && !readonly"
            class="text-center"
          >
            <input
              type="checkbox"
              :value="getRowId(row, rowIndex)"
              v-model="selectedIds"
              aria-label="Select row"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, type PropType } from "vue";
import confirmDialog from "@/shared/utils/confirm";
import type { DeletePayload } from "@/types/DeletePayload";

export type Column<T> = {
  field: keyof T;
  label: string;
  hidden?: boolean;
  width?: string;
  tdClass?: string;
  headerClass?: string;
  align?: "left" | "center" | "right";
  truncate?: boolean; // show ellipsis
  type?: string; // e.g. 'date'
};

export type GenericRow = Record<string, any>;

const props = defineProps({
  columns: { type: Array as PropType<Column<any>[]>, required: true },
  rows: { type: Array as PropType<any[]>, required: true },

  keepHiddenInDom: { type: Boolean, default: false },
  exposeHiddenAsDataAttributes: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  showActions: { type: Boolean, default: true },
  actionsWidth: { type: String, default: "120px" },

  // checkbox placement
  checkboxPosition: {
    type: String as PropType<"left" | "right">,
    default: "left",
  },

  // compact layout (smaller paddings / fonts)
  compact: { type: Boolean, default: false },

  idAccessor: { type: Function as PropType<(row: any) => any>, default: null },

  // bulk options
  enableBulkDelete: { type: Boolean, default: false },
  minBulkCount: { type: Number, default: 1 },
  bulkDeleteLabel: { type: String, default: "Delete Selected" },
});

const emit = defineEmits<{
  (e: "edit", payload: DeletePayload<any>): void;
  (e: "delete", payload: DeletePayload<any>): void;
  (e: "bulk-delete", ids: string[]): void;
  (e: "selection-change", ids: string[]): void;
}>();

const selectedIds = ref<string[]>([]);
const deleting = ref(false);

const selectedCount = computed(() =>
  Array.isArray(selectedIds.value) ? selectedIds.value.length : 0
);

const visibleColumns = computed(() =>
  Array.isArray(props.columns) ? props.columns.filter((c) => !c.hidden) : []
);
const hiddenColumns = computed(() =>
  Array.isArray(props.columns) ? props.columns.filter((c) => c.hidden) : []
);
const hiddenButPresentColumns = computed(() =>
  props.keepHiddenInDom ? hiddenColumns.value : []
);

const allSelected = computed(() => {
  if (!Array.isArray(props.rows) || props.rows.length === 0) return false;
  const allIds = props.rows.map((r, i) => String(getRowId(r, i)));
  return allIds.every((id) => selectedIds.value.map(String).includes(id));
});

const colspan = computed(() => {
  const base =
    visibleColumns.value.length +
    (props.showActions && !props.readonly ? 1 : 0);
  return base + (props.enableBulkDelete ? 1 : 0);
});

function getFieldValue(row: GenericRow, col: Column<any>) {
  return (row as any)[String(col.field)];
}

function formatValue(value: any, col?: Column<any>) {
  if (value == null || value === "") return "";
  if (col?.type === "date") {
    const d = new Date(value);
    if (isNaN(d.getTime())) return value;
    return d
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .replace(/ /g, "-");
  }
  return value;
}

function cellClass(col: Column<any>) {
  const align = col.align ?? "left";
  return [
    col.tdClass ?? "",
    align === "right"
      ? "text-end"
      : align === "center"
      ? "text-center"
      : "text-start",
    col.truncate ? "truncate-cell" : "",
  ].join(" ");
}

function handleEdit(row: GenericRow, rowIndex?: number) {
  const payload: DeletePayload = {
    id: getRowId(row, rowIndex ?? 0),
    row,
    rowIndex,
  };
  emit("edit", payload);
}

function handleDelete(row: GenericRow, rowIndex?: number) {
  const payload: DeletePayload = {
    id: getRowId(row, rowIndex ?? 0),
    row,
    rowIndex,
  };
  // always emit normalized payload
  emit("delete", payload);
}

function getRowId(row: GenericRow, rowIndex: number) {
  const id = props.idAccessor
    ? props.idAccessor(row)
    : row?.id ?? row?.Id ?? rowIndex;
  return String(id);
}

function getRowKey(row: GenericRow, rowIndex: number) {
  const maybe = props.idAccessor ? props.idAccessor(row) : row?.id ?? rowIndex;
  return maybe != null ? maybe : rowIndex;
}

function toggleSelectAll(e: Event | boolean) {
  let checked = false;
  if (typeof e === "boolean") checked = e;
  else {
    const t = e.target as HTMLInputElement | null;
    checked = !!(t && t.checked);
  }
  if (!checked) {
    selectedIds.value = [];
    emit("selection-change", []);
    return;
  }
  selectedIds.value = (props.rows || []).map((r: any, i: number) =>
    getRowId(r, i)
  );
  emit("selection-change", [...selectedIds.value]);
}

async function onBulkDelete() {
  if (!selectedIds.value || selectedIds.value.length === 0) return;
  const idsToDelete = [...selectedIds.value];
  const ok = await (
    confirmDialog as unknown as (opts: any) => Promise<boolean>
  )({
    title: "Confirm Delete",
    message: `Delete <strong>${idsToDelete.length}</strong> items? This action cannot be undone.`,
    confirmText: "Delete",
    cancelText: "Cancel",
    confirmClass: "btn-danger",
  });
  if (!ok) return;
  deleting.value = true;
  try {
    emit("bulk-delete", idsToDelete);
    selectedIds.value = [];
    emit("selection-change", []);
  } finally {
    deleting.value = false;
  }
}
</script>

<style scoped>
/* remove all borders globally for this table */
.table-container .table,
.table-container .table th,
.table-container .table td {
  border: none !important;
}

/* HEADER – bold, dark, no background */
.table-container thead th {
  font-weight: 700 !important;
  font-size: 14px;
  color: #000 !important;
  text-transform: uppercase;
  background: none !important; /* remove Bootstrap grey */
  padding: 14px 10px;
  border-bottom: 1px solid #e5e5e5 !important; /* keep soft separator */
}

/* BODY CELLS */
.table-container tbody td {
  padding: 18px 10px;
  font-size: 15px;
  color: #000 !important;
  border-bottom: 1px solid #f1f1f1 !important;
}

/* Row hover (optional) */
.table-container tbody tr:hover {
  background: #fafafa;
}
</style>
