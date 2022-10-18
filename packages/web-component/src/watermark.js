import { genWatermark } from "@watermark/core";
export class Watermark extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement("template");
    template.innerHTML = `
        <style>
            :host {
                display: block;
            }
        </style>
        <slot></slot>
      `;

    this.shadowRoot = this.attachShadow({
      mode: "open",
    });

    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  static observerChangedCallback() {
    return ["content", "font"];
  }
}
