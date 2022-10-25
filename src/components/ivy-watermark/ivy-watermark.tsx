import { Component, Host, h, Prop, State, Watch } from '@stencil/core';
import { createImgBase } from '../../utils/utils';

@Component({
  tag: 'ivy-watermark',
  styleUrl: 'ivy-watermark.css',
  shadow: true,
})
export class IvyWatermark {
  @State() image: string = null;

  @Prop() zIndex: string = '1000';

  @State() watermarkIndex: string = '1000';

  @Watch('zIndex')
  watchZIndexHandler(val: string) {
    this.watermarkIndex = parseInt(val).toFixed(0);
  }

  render() {
    return (
      <Host>
        <div class="watermark" tabindex="-1" style={{ zIndex: this.watermarkIndex, backgroundImage: `var(--ivy-watermark-url, url(${this.image}))` }}></div>
        <slot></slot>
      </Host>
    );
  }

  componentWillLoad() {
    this.image = createImgBase({
      width: 100,
      height: 100,
      content: '水印',
      font: '14px PingFang SC, sans-serif',
      color: 'rgba(156, 162, 169, 0.3)',
      rotateDegree: (-14 * Math.PI) / 180,
      x: 80,
      y: 80,
    });
  }
}
