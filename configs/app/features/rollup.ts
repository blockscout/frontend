import { getEnvValue } from '../utils';

export default Object.freeze({
  title: 'Rollup (L2) chain',
  isEnabled: getEnvValue(process.env.NEXT_PUBLIC_IS_L2_NETWORK) === 'true',
  L1BaseUrl: getEnvValue(process.env.NEXT_PUBLIC_L1_BASE_URL) ?? '',
  withdrawalUrl: getEnvValue(process.env.NEXT_PUBLIC_L2_WITHDRAWAL_URL) ?? '',
});
