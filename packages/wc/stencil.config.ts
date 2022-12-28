import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'ivy-watermark',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements',
      autoDefineCustomElements: true,
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
  ],
};
