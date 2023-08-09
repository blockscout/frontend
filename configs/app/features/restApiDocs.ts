import { getEnvValue } from '../utils';

const specUrl = getEnvValue(process.env.NEXT_PUBLIC_API_SPEC_URL);

export default Object.freeze({
  title: 'REST API documentation',
  isEnabled: Boolean(specUrl),
  specUrl,
});
