// import type { Feature } from './types';

const apiEndpoint = 'http://172.16.13.130:8153';

const title = 'Blockchain statistics';

const config = (() => {
  if (apiEndpoint) {
    return Object.freeze({
      title,
      isEnabled: true,
      api: {
        endpoint: apiEndpoint,
        basePath: '',
      },
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
    api: {
      endpoint: apiEndpoint,
      basePath: '',
    },
  });
})();

export default config;
