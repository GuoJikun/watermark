import { newE2EPage } from '@stencil/core/testing';

describe('ivy-watermark', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ivy-watermark></ivy-watermark>');

    const element = await page.find('ivy-watermark');
    expect(element).toHaveClass('hydrated');
  });
});
