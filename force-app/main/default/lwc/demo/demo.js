// Parent component JS
import { LightningElement } from "lwc";

export default class MyComponent extends LightningElement {
  handleOpenModal() {
    this.template.querySelector("c-procrewz-modal").open();
  }

  handleModalClose() {
    console.log("Modal closed");
  }

  handleCancel() {
    this.template.querySelector("c-procrewz-modal").close();
  }

  handleConfirm() {
    // Do something
    this.template.querySelector("c-procrewz-modal").close();
  }
}
