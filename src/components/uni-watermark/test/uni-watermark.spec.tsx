import { newSpecPage } from '@stencil/core/testing';
import { UniWatermark } from '../uni-watermark';

describe('uni-watermark', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [UniWatermark],
      html: `<uni-watermark></uni-watermark>`,
    });
    expect(page.root).toEqualHtml(`
      <uni-watermark>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </uni-watermark>
    `);
  });
});
