import { getEnvValue } from '../utils';

const dsn = getEnvValue(process.env.NEXT_PUBLIC_SENTRY_DSN);

// TODO @tom2drum check sentry setup
export default Object.freeze({
  title: 'Sentry error monitoring',
  isEnabled: Boolean(dsn),
  dsn,
  environment: getEnvValue(process.env.NEXT_PUBLIC_APP_ENV) || getEnvValue(process.env.NODE_ENV),
  cspReportUrl: getEnvValue(process.env.SENTRY_CSP_REPORT_URI),
  instance: getEnvValue(process.env.NEXT_PUBLIC_APP_INSTANCE),
});
