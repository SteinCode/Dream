import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
  constructor() {
    super();
    this.setTitle("Profile");
  }

  async getHtml() {
    //sitoje vietoje reiks pasiimti duomenis is database su fetch api arba ajax
    return `
    <h1>tu matai profile </h1>
    `;
  }
}
