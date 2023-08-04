import { getEnvValue } from '../utils';
import verified_tokens from './verified_tokens';

const adminServiceApiHost = getEnvValue(process.env.NEXT_PUBLIC_ADMIN_SERVICE_API_HOST);

export default Object.freeze({
  title: 'Address verification in "My account"',
  isEnabled: verified_tokens.isEnabled && Boolean(),
  api: {
    endpoint: adminServiceApiHost,
    basePath: '',
  },
});
