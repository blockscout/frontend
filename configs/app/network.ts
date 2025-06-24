import { getEnvValue } from './utils';

const name = getEnvValue('NEXT_PUBLIC_KADENA_NETWORK_NAME') ?? 'devnet';

const network = Object.freeze({
  name,
});

export default network;
