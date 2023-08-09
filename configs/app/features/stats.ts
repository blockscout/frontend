import { getEnvValue } from '../utils';

const apiEndpoint = getEnvValue(process.env.NEXT_PUBLIC_STATS_API_HOST);

export default Object.freeze({
  title: 'Blockchain statistics',
  isEnabled: Boolean(apiEndpoint),
  api: {
    endpoint: apiEndpoint,
    basePath: '',
  },
});
