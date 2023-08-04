import chain from '../chain';
import { getEnvValue } from '../utils';

const configUrl = getEnvValue(process.env.NEXT_PUBLIC_MARKETPLACE_CONFIG_URL);
const submitForm = getEnvValue(process.env.NEXT_PUBLIC_MARKETPLACE_SUBMIT_FORM);

export default Object.freeze({
  title: 'Marketplace',
  isEnabled: Boolean(chain.rpcUrl && configUrl && submitForm),
  configUrl: configUrl ?? '',
  submitFormUrl: submitForm ?? '',
});
