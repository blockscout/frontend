import { getEnvValue } from '../utils';

const apiEndpoint = getEnvValue(process.env.NEXT_PUBLIC_VISUALIZE_API_HOST);

export default Object.freeze({
  title: 'Solidity to UML diagrams',
  isEnabled: Boolean(apiEndpoint),
  api: {
    endpoint: apiEndpoint,
    basePath: '',
  },
});
