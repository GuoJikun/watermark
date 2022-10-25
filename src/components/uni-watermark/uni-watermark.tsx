import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'uni-watermark',
  styleUrl: 'uni-watermark.css',
  shadow: true,
})
export class UniWatermark {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
