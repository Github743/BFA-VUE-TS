// src/modules/shared/utils/toast.ts
import { Toast as BSToast } from "bootstrap";

/**
 * Toast types supported by the helper
 */
export type ToastType = "success" | "warning" | "danger" | "info";

export interface ShowToastOptions {
  title?: string;
  showProgress?: boolean;
  delay?: number; // ms
}

/* small icon map (bootstrap icons expected on the page) */
const toastIcons: Record<ToastType, string> = {
  success: `<i class="bi bi-check-circle-fill me-2"></i>`,
  warning: `<i class="bi bi-exclamation-triangle-fill me-2"></i>`,
  danger: `<i class="bi bi-x-circle-fill me-2"></i>`,
  info: `<i class="bi bi-info-circle-fill me-2"></i>`,
};

/**
 * Show a toast message.
 *
 * Note: bootstrap's Toast class typing can be strict depending on your @types/bootstrap presence.
 * We instantiate using `BSToast as any` to avoid compilation issues if types are missing.
 */
export function showToast(
  message: string,
  type: ToastType = "danger",
  title = "",
  showProgress = true,
  delay = 4000
): void {
  const icon = toastIcons[type] || "";
  const heading = title || type.charAt(0).toUpperCase() + type.slice(1);

  const progressColors: Record<ToastType, string> = {
    success: "bg-success",
    warning: "bg-warning",
    danger: "bg-danger",
    info: "bg-info",
  };
  const progressColor = progressColors[type] || "bg-light";

  // Create toast element
  const toastEl = document.createElement("div");
  toastEl.className = `toast text-bg-${type} border-0 shadow overflow-hidden mb-2`;
  toastEl.setAttribute("role", "alert");
  toastEl.setAttribute("aria-live", "assertive");
  toastEl.setAttribute("aria-atomic", "true");

  toastEl.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">
        <strong>${icon}${heading}</strong>
        <div>${escapeHtml(String(message))}</div>
      </div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto"
              data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
    ${
      showProgress
        ? `
      <div class="progress" style="height: 4px;">
        <div class="progress-bar ${progressColor}" role="progressbar"></div>
      </div>`
        : ""
    }
  `;

  // Append to container
  const container = document.getElementById("toast-container") || createToastContainer();
  container.appendChild(toastEl);

  // Initialize and show toast
  // use `as any` to avoid TS construct signature problems if types not available
  const ToastCtor = (BSToast as unknown) as any;
  const bsToast = new ToastCtor(toastEl, { delay });
  bsToast.show();

  // Animate progress bar if enabled
  if (showProgress) {
    const bar = toastEl.querySelector<HTMLElement>(".progress-bar");
    if (bar) {
      // Start full width, shrink to 0
      bar.style.width = "100%";
      // a small timeout to allow initial paint
      window.setTimeout(() => {
        bar.style.transition = `width ${delay}ms linear`;
        bar.style.width = "0%";
      }, 100);
    }
  }

  // Remove from DOM when hidden
  // Bootstrap fires 'hidden.bs.toast' on the element when toast is hidden
  const onHidden = () => {
    try {
      toastEl.removeEventListener("hidden.bs.toast", onHidden as EventListener);
    } catch {}
    if (toastEl.parentNode) toastEl.parentNode.removeChild(toastEl);
  };

  // attach listener (use any to avoid TS mismatch for custom event)
  (toastEl as any).addEventListener("hidden.bs.toast", onHidden);
}

/** Create container for toasts (positioned top-right) */
function createToastContainer(): HTMLElement {
  const container = document.createElement("div");
  container.id = "toast-container";
  container.className = "toast-container position-fixed top-0 end-0 p-3";
  container.style.zIndex = "1100";
  document.body.appendChild(container);
  return container;
}

/** Simple html escape for messages to avoid accidental HTML injection.
 *  We still allow title/icons to contain markup intentionally.
 */
function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
