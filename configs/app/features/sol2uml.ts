// import type { Feature } from './types';

// const apiEndpoint = 'http://172.16.13.130:8153';
const apiEndpoint = 'https://stats-eth-main.k8s.blockscout.com';

const title = 'Solidity to UML diagrams';

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
  });
})();

export default config;
