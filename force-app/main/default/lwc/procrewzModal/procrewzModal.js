import { api, LightningElement, track } from "lwc";

export default class ProcrewzModal extends LightningElement {
  @api title = "";
  @api size = "medium"; // small, medium, large, full
  @api hideCloseButton = false;

  @track isOpen = false;

  // Store the element that triggered the modal for focus return
  _triggerElement = null;
  _focusableElements = [];

  get modalClass() {
    return `procrewz-modal procrewz-modal--${this.size}`;
  }

  get showCloseButton() {
    return !this.hideCloseButton;
  }

  get showHeader() {
    return this.title || this.showCloseButton;
  }

  @api
  open() {
    // Store the currently focused element to return focus when modal closes
    this._triggerElement = document.activeElement;
    this.isOpen = true;
    this.dispatchEvent(new CustomEvent("open"));

    // Focus the modal after it renders
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    requestAnimationFrame(() => {
      this._setupFocusTrap();
      this._focusFirstElement();
    });
  }

  @api
  close() {
    this.isOpen = false;
    this.dispatchEvent(new CustomEvent("close"));

    // Return focus to the trigger element
    if (
      this._triggerElement &&
      typeof this._triggerElement.focus === "function"
    ) {
      // eslint-disable-next-line @lwc/lwc/no-async-operation
      requestAnimationFrame(() => {
        this._triggerElement.focus();
        this._triggerElement = null;
      });
    }
  }

  _setupFocusTrap() {
    const modal = this.template.querySelector(".procrewz-modal");
    if (!modal) return;

    // Find all focusable elements within the modal
    const focusableSelectors = [
      "button:not([disabled])",
      "a[href]",
      "input:not([disabled])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      '[tabindex]:not([tabindex="-1"])'
    ].join(", ");

    this._focusableElements = Array.from(
      modal.querySelectorAll(focusableSelectors)
    );
  }

  _focusFirstElement() {
    // Try to focus the close button first, or the first focusable element
    const closeButton = this.template.querySelector(".procrewz-modal__close");
    if (closeButton) {
      closeButton.focus();
    } else if (this._focusableElements.length > 0) {
      this._focusableElements[0].focus();
    } else {
      // If no focusable elements, focus the modal container itself
      const modal = this.template.querySelector(".procrewz-modal");
      if (modal) {
        modal.setAttribute("tabindex", "-1");
        modal.focus();
      }
    }
  }

  handleBackdropClick(event) {
    // Close when clicking the backdrop (not the modal content)
    if (event.target.classList.contains("procrewz-modal__backdrop")) {
      this.close();
    }
  }

  handleCloseClick() {
    this.close();
  }

  handleKeyDown(event) {
    if (event.key === "Escape") {
      this.close();
      return;
    }

    // Focus trap: Tab and Shift+Tab
    if (event.key === "Tab" && this._focusableElements.length > 0) {
      const firstElement = this._focusableElements[0];
      const lastElement =
        this._focusableElements[this._focusableElements.length - 1];

      if (event.shiftKey) {
        // Shift+Tab: if on first element, go to last
        if (
          document.activeElement === firstElement ||
          this.template.activeElement === firstElement
        ) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab: if on last element, go to first
        if (
          document.activeElement === lastElement ||
          this.template.activeElement === lastElement
        ) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }
  }
}
