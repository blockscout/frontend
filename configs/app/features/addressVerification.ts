import { getEnvValue } from '../utils';
import account from './account';
import verifiedTokens from './verifiedTokens';

const adminServiceApiHost = getEnvValue(process.env.NEXT_PUBLIC_ADMIN_SERVICE_API_HOST);

export default Object.freeze({
  title: 'Address verification in "My account"',
  isEnabled: account.isEnabled && verifiedTokens.isEnabled && Boolean(adminServiceApiHost),
  api: {
    endpoint: adminServiceApiHost,
    basePath: '',
  },
});
