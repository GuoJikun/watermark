import { newE2EPage } from '@stencil/core/testing';

describe('uni-watermark', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<uni-watermark></uni-watermark>');

    const element = await page.find('uni-watermark');
    expect(element).toHaveClass('hydrated');
  });
});
