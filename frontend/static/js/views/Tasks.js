import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
  constructor() {
    super();
    this.setTitle("Tasks");
  }

  async getHtml() {
    //sitoje vietoje reiks pasiimti duomenis is database su fetch api arba ajax
    return `
    <h1>tu matai tasks </h1>
    `;
  }
}
