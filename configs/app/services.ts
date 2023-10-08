import { getEnvValue } from './utils';

export default Object.freeze({
  reCaptcha: {
    siteKey: getEnvValue('NEXT_PUBLIC_RE_CAPTCHA_APP_SITE_KEY'),
  },
});
