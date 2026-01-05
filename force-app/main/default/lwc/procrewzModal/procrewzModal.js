import { api, LightningElement, track } from "lwc";

export default class ProcrewzModal extends LightningElement {
  @api title = "";
  @api size = "medium"; // small, medium, large, full
  @api hideCloseButton = false;

  @track isOpen = false;

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
    this.isOpen = true;
    this.dispatchEvent(new CustomEvent("open"));
  }

  @api
  close() {
    this.isOpen = false;
    this.dispatchEvent(new CustomEvent("close"));
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
    }
  }
}
