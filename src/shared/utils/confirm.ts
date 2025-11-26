import { Modal } from "bootstrap";

// Props for confirm dialog
export interface ConfirmOptions {
  title?: string;
  message?: string; // can contain HTML
  confirmText?: string;
  cancelText?: string;
  confirmClass?: string; // e.g. "btn-danger"
}

/**
 * Shows a Bootstrap confirm dialog and returns a Promise<boolean>.
 * 
 * Usage:
 * const ok = await confirmDialog({ title: "...", message: "..." });
 */
export default function confirmDialog(options: ConfirmOptions = {}): Promise<boolean> {
  const {
    title = "Please confirm",
    message = "Are you sure?",
    confirmText = "Yes",
    cancelText = "Cancel",
    confirmClass = "btn-danger",
  } = options;

  return new Promise<boolean>((resolve) => {
    let resolved = false;

    const container = document.createElement("div");
    container.className = "modal fade";
    container.tabIndex = -1;

    container.innerHTML = `
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">${title}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div>${message}</div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${cancelText}</button>
            <button type="button" class="btn ${confirmClass}" id="__confirmBtn">${confirmText}</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(container);

    const modal = new Modal(container, {
      backdrop: "static",
      keyboard: true,
    });

    const cleanup = (result: boolean) => {
      if (resolved) return;
      resolved = true;

      try {
        modal.hide();
      } catch {}

      resolve(result);
    };

    const confirmBtn = container.querySelector("#__confirmBtn") as HTMLElement;

    const onConfirm = () => cleanup(true);
    confirmBtn.addEventListener("click", onConfirm);

    const onHidden = () => {
      confirmBtn.removeEventListener("click", onConfirm);
      container.removeEventListener("hidden.bs.modal", onHidden);

      try {
        modal.dispose();
      } catch {}

      if (container.parentNode) container.parentNode.removeChild(container);

      // If user closed without confirming
      if (!resolved) {
        resolved = true;
        resolve(false);
      }
    };

    container.addEventListener("hidden.bs.modal", onHidden);

    modal.show();
  });
}
