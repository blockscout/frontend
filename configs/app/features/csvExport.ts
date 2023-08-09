import { getEnvValue } from '../utils';

const reCaptchaSiteKey = getEnvValue(process.env.NEXT_PUBLIC_RE_CAPTCHA_APP_SITE_KEY);

export default Object.freeze({
  title: 'Export data to CSV file',
  isEnabled: Boolean(reCaptchaSiteKey),
  reCaptcha: {
    siteKey: reCaptchaSiteKey ?? '',
  },
});
