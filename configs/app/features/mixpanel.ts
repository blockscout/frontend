import { getEnvValue } from '../utils';

const projectToken = getEnvValue(process.env.NEXT_PUBLIC_MIXPANEL_PROJECT_TOKEN);

export default Object.freeze({
  title: 'Mixpanel analytics',
  isEnabled: Boolean(projectToken),
  projectToken: projectToken ?? '',
});
