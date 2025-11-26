import confirmDialog from "@/shared/utils/confirm";
import type { DeletePayload } from "@/types/DeletePayload";

export async function confirmDelete<T>(
  payload: DeletePayload<T>,
  options?: {
    title?: string;
    getMessage?: (row: T) => string;
    confirmText?: string;
    cancelText?: string;
    confirmClass?: string;
  }
): Promise<boolean> {
  const {
    title = "Confirm Delete",
    getMessage = () => "Are you sure you want to delete this item?",
    confirmText = "Delete",
    cancelText = "Cancel",
    confirmClass = "btn-danger",
  } = options || {};

  const message = getMessage(payload.row);

  const confirmed = await confirmDialog({
    title,
    message,
    confirmText,
    cancelText,
    confirmClass,
  });

  return confirmed;
}
