import { getEnvValue } from '../utils';

const contractInfoApiHost = getEnvValue(process.env.NEXT_PUBLIC_CONTRACT_INFO_API_HOST);

export default Object.freeze({
  title: 'Verified tokens info',
  isEnabled: Boolean(contractInfoApiHost),
  api: {
    endpoint: contractInfoApiHost,
    basePath: '',
  },
});
