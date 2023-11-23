import { getEnvValue } from '../../configs/app/utils';

export const isUniversalProfileEnabled = () => {
  const env = getEnvValue('NEXT_PUBLIC_VIEWS_ADDRESS_IDENTICON_TYPE');
  return env === undefined ? false : env.includes('universal_profile');
};
