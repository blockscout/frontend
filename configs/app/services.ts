import { getEnvValue } from './utils';

export default Object.freeze({
  reCaptchaV3: {
    siteKey: getEnvValue('NEXT_PUBLIC_RE_CAPTCHA_V3_APP_SITE_KEY'),
  },
});
