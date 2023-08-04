import { getEnvValue } from './utils';

export default Object.freeze({
  reCaptcha: {
    siteKey: getEnvValue(process.env.NEXT_PUBLIC_RE_CAPTCHA_APP_SITE_KEY),
  },
});
