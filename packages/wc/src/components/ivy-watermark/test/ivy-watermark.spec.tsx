import { newSpecPage } from '@stencil/core/testing';
import { IvyWatermark } from '../ivy-watermark';

describe('ivy-watermark', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [IvyWatermark],
      html: `<ivy-watermark></ivy-watermark>`,
    });
    expect(page.root).toEqualHtml(`
      <ivy-watermark>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ivy-watermark>
    `);
  });
});
