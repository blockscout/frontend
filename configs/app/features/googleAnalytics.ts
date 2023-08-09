import { getEnvValue } from '../utils';

const propertyId = getEnvValue(process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_PROPERTY_ID);

export default Object.freeze({
  title: 'Google analytics',
  isEnabled: Boolean(propertyId),
  propertyId,
});
